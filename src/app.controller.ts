import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { responseSuccess } from './utils/response-parser';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed')
  async seed() {
    if (process.env.NODE_ENV === 'development') {
      await this.appService.seed();
    }
    return responseSuccess('Data seeded', undefined);
  }
}
