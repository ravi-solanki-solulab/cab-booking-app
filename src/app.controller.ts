import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags("baseurl")
export class AppController {
  constructor(
    private readonly appService: AppService) { }

  @Get()
  async getHello() {
    const response = await this.appService.getHello();
    return response;
  }
}


