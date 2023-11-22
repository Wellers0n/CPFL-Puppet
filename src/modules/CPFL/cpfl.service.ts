import { Injectable } from '@nestjs/common';
import { PuppeteerService } from '@app/shared/puppeteer/puppeteer.service';
import { delay } from '@app/shared/puppeteer/puppeteer.constant';
import { CPFLUrls, baseURL } from '@app/modules/CPFL/cpfl.constant';
import { CPFLDownloadBillDTO } from '@app/modules/CPFL/dtos/cpfl.dto';
import fetch from 'node-fetch';
import * as fs from 'fs'

@Injectable()
export class CPFLService {
  private browser;
  private page;
  private access;

  constructor(private readonly puppeterService: PuppeteerService) {
  }

  public async login(email: string, password: string) {
    const { page, browser } = await this.puppeterService.openBrowser()

    this.browser = browser
    this.page = page

    const { smDelay, lgDelay } = delay

    this.page.on('response', async (response) => {
      const request = response.request();
      if (request.url().includes('api/token')) {
        const text = await response.text();
        console.log('TEXT >> ', text)
        this.access = text;
      }
    })

    await this.puppeterService.navigate(CPFLUrls.login);

    await this.puppeterService.delay(smDelay);

    await this.puppeterService.evaluate(`
    const loginBtn = document.querySelector('[href="/b2c-auth/login"]')
    if (loginBtn) {
      loginBtn.click();
    }
    `);
    await this.puppeterService.delay(smDelay);

    this.puppeterService.log(`Current URL: ${this.page.url()}`)

    await this.puppeterService.type('#signInName', email);
    await this.puppeterService.type('#password', password, { hide: true });

    await this.puppeterService.evaluate(`
    const submitBtn  = document.querySelector('[type="submit"]')
    if (submitBtn) {
      submitBtn.click();
    }
    `);

    await this.puppeterService.delay(lgDelay);

    this.browser.close()

    return this.access

  }


  public async findInstallations(token: string, installationId: string) {

    console.log(token)

    const url = `${baseURL}/agencia-webapi/api/instalacao/${installationId}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
    };

    try {
      const response = await fetch(url, requestOptions)

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Erro na requisição FETCH:', error);
    }

  }

  public async downloadBills(payload: CPFLDownloadBillDTO, token: string) {
    const urlAllBills = `${baseURL}/agencia-webapi/api/historico-contas/contas-quitadas`;

    try {
      const response = await fetch(urlAllBills, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      await data.ContasPagas.map(async (conta) => {
      const urlPDFFetch = `${baseURL}/agencia-webapi/api/historico-contas/conta-completa?numeroContaEnergia=${conta.NumeroContaEnergia}&codigoClasse=${payload.CodigoClasse}&codEmpresaSAP=${payload.CodEmpresaSAP}&instalacao=${encodeURIComponent(payload.Instalacao)}&parceiroNegocio=${encodeURIComponent(payload.ParceiroNegocio)}&token=${token.split('Bearer ')[1]}&contaAcumulada=false`
      const localFileName = `./src/modules/CPFL/PDFs/${conta.DataPagamento}.pdf`;

      const responsePdf = await fetch(urlPDFFetch, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          path: urlPDFFetch,
          schema: 'https',
          authority: 'servicosonline.cpfl.com.br',
          'Sec-Fetch-Site': 'servicosonline.cpfl.com.br',
          Referer: 'https://servicosonline.cpfl.com.br/agencia-webapp/'
        },
      })

      const pdfBuffer = await responsePdf.buffer()

      fs.writeFileSync(localFileName, pdfBuffer, 'binary');

      console.log(`Download do pdf referente ao mês ${conta.MesReferencia} concluído!`);

      new Promise(function (resolve) {
        setTimeout(resolve, 5000);
      });

      
      })

      return data
    } catch (error) {
      console.error('Erro na requisição FETCH:', error);
    }




  }






}
