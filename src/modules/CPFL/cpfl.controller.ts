import { Body, Controller, ExecutionContext, Headers, HttpCode, Post, Request } from '@nestjs/common'
import { CPFLService } from '@app/modules/CPFL/cpfl.service';
import { CPFLLoginDTO, CPFLFindInstallationDTO, CPFLDownloadBillDTO } from '@app/modules/CPFL/dtos/cpfl.dto';

@Controller('/cpfl')
export class CPFLController {
  constructor(private readonly CpflService: CPFLService) { }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: CPFLLoginDTO) {

    const { email, password } = body

    const response = await this.CpflService.login(email, password)

    const data = JSON.parse(response)

    return data

  }

  @Post('/installation')
  @HttpCode(200)
  async findInstallation(@Body() body: CPFLFindInstallationDTO, @Request() request) {

    const { installationId } = body
    const token = request.headers.authorization


    const response = await this.CpflService.findInstallations(token, installationId)

    return response
  }

  @Post('/download/bills')
  @HttpCode(200)
  async findBills(@Body() body: CPFLDownloadBillDTO, @Request() request) {

    const token = request.headers.authorization

    const response = await this.CpflService.downloadBills(body, token)

    return response
  }
}