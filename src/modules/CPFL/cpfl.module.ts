import { Module } from '@nestjs/common';
import { CPFLController } from '@app/modules/CPFL/cpfl.controller';
import { CPFLService } from '@app/modules/CPFL/cpfl.service';
import { PuppeteerService } from '@app/shared/puppeteer/puppeteer.service';

@Module({
  imports: [],
  controllers: [CPFLController],
  providers: [CPFLService, PuppeteerService],
})
export class CPFLModule { }
