import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('/health')
  healthcheck() {
    return { message: 'Server up 🚀' }

  }
}