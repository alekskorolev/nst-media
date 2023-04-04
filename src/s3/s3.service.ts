import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, UploadedObjectInfo } from 'minio';
import { v4 } from 'uuid';
import { extension } from 'mime-types'

@Injectable()
export class S3Service {
  @Inject(ConfigService)
  private config: ConfigService
  private client: Client
  private bucket: string
  private baseFilesUrl: string

  public async onModuleInit(): Promise<void> {
    const clientOptions = {
      endPoint: this.config.get('S3_ENDPOIND'),
      port: parseInt(this.config.get('S3_PORT'), 10),
      useSSL: this.config.get('S3_SSL') === true,
      accessKey: this.config.get('S3_KEY'),
      secretKey: this.config.get('S3_SECRET')
    }
    this.bucket = this.config.get('S3_BUCKET')
    this.client = new Client(clientOptions)
    this.baseFilesUrl = `${clientOptions.useSSL ? 'https' : 'http'}://${clientOptions.endPoint}`
    if (clientOptions.port !== 80) {
      this.baseFilesUrl = `${this.baseFilesUrl}:${clientOptions.port}/${this.bucket}/`
    } else {
      this.baseFilesUrl = `${this.baseFilesUrl}/${this.bucket}/`
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${v4()}.${extension(file.mimetype)}`;
    return new Promise((resolve, reject) => this.client.putObject(
      this.bucket, filename, file.buffer, file.size, { 'Content-Type': file.mimetype },
      (err, info) => {
        if (err) {
          return reject(err)
        }
        resolve(`${this.baseFilesUrl}${filename}`)
      }
    ));
  }
}