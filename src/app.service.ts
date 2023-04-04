import { Inject, Injectable } from '@nestjs/common';
import { S3Service } from './s3/s3.service';

@Injectable()
export class AppService {
  @Inject(S3Service)
  private storage: S3Service;
  getHello(): string {
    return 'Hello World!';
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    const filename = await this.storage.saveFile(file);
    return filename;
  }
}
