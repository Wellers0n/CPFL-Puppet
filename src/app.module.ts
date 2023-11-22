import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { PuppeteerModule } from '@app/shared/puppeteer/puppeteer.module';
import { CPFLModule } from '@app/modules/CPFL/cpfl.module';

@Module({
  imports: [PuppeteerModule, CPFLModule],
  controllers: [AppController],
})
export class AppModule {}
