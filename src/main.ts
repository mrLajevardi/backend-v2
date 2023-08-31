import {NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import * as Sentry from '@sentry/node';
import * as process from "process";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  Sentry.init({
    dsn: process.env.DSN_SENTRY ,
    debug:true,
  });


  const config = new DocumentBuilder()
    .setTitle('Arad API')
    .setDescription('Arad api swagger test ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();

