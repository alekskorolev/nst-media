import { Controller, Get, NotAcceptableException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  getHello(): string {
    return this.service.getHello();
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
    try {
      const url = await this.service.upload(file)
      return url;
    } catch (e) {
      throw new NotAcceptableException()
    }
  }
}
