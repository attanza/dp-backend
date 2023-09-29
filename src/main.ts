import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { envalidate } from './utils/envalidate';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './utils/http-exception.filter';
import mongoose from 'mongoose';
async function bootstrap() {
  envalidate();
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  mongoose.set('debug', true);
  app.enableCors({
    origin: ['http://localhost:3000'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(PORT || 10000);
  Logger.log(`Backend running at http://localhost:${PORT}`);
}
bootstrap();
