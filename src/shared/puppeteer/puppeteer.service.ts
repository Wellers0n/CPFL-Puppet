import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { window_puppeteer } from '@app/shared/puppeteer/puppeteer.constant';

@Injectable()
export class PuppeteerService {
    private browser;
    private page;

    async openBrowser() {
        this.browser = await puppeteer.launch({
            // executablePath: 'chromiun',
            headless: false,
            timeout: 6000,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [
                '--no-sandbox',
                '--disabled-setupid-sandbox',
                '--disable-web-security',
                '--no-zygote',
                // `--window-size=${window_puppeteer.WINDOW_WIDTH},${window_puppeteer.WINDOW_HEIGHT}`,
            ],
            defaultViewport: null,
        });

        this.page = await this.browser.newPage();

        return { page: this.page, browser: this.browser }
    }

    async type(
        field: string,
        value: string,
        options?: { hide: boolean },
        delay = 80,
    ) {
        await this.page.type(field, value, { delay });

        if (!options?.hide) {
            this.log(`field: ${field} \n value: ${value}`);
        }
    }

    async evaluate(method: string) {
        await this.page.evaluate(method);
        this.log(`eval() => : \n ${method}`);
    }

    async navigate(url: string) {
        await this.page.goto(url, {
            networkIdleTimeout: 0,
            waitUntil: 'networkidle0',
        });
        this.log(`Navigate to: ${url}`);
    }

    async click(selector: string) {
        await this.page.click(selector);
        this.log(`Click: ${selector}`);
    }

    async pressKey(key: string) {
        await this.page.keyboard.press(key);
        this.log(`Keyboard: ${key}`);
    }

    async tap(selector: string) {
        await this.page.tap(selector);

        this.log(`Tap: ${selector}`);
    }

    async delay(time: number) {
        this.log(`Waiting: ${time}ms`);
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }

    error(message: string) {
        console.error(
            JSON.stringify(
                {
                    module: 'puppeteer-module',
                    message,
                },
                null,
                2,
            ),
        );
    }

    log(message: string) {
        console.log(
            JSON.stringify(
                {
                    module: 'puppeteer-module',
                    message,
                },
                null,
                2,
            ),
        );
    }

}
