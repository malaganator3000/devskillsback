import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('API_PORT');
  const HOST = configService.get('API_HOST');
  const VERSION = configService.get('API_VERSION');
  app.setGlobalPrefix(VERSION);
  await app.listen(PORT).then(() => {
    Logger.log(`Api running on http://${HOST}:${PORT}`);
  });
}
bootstrap().catch(Logger.error);
