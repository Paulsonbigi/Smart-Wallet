import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ExceptionsLoggerFilter } from "./utils/exceptionsLogger.filter"
import { config } from 'aws-sdk';


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string
const AWS_SECURITY_KEY = process.env.AWS_SECURITY_KEY as string

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));
  config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECURITY_KEY,
  });
  await app.listen(port, () => {
    console.log('[WEB]', configService.get<string>('BASE_URL'));
  });
}

bootstrap();