import { Module } from '@nestjs/common';
import { PuppeteerService } from '@app/shared/puppeteer/puppeteer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PuppeteerService],
})
export class PuppeteerModule { }
