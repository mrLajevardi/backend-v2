import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import * as Sentry from '@sentry/node';
import {SentryFilter} from "./SentryFilter";
import { SentryService } from '@ntegral/nestjs-sentry';

async function bootstrap() {
  Sentry.init({
    dsn: 'https://ee742f74e227daa8c634dee6ad5ecd07@FUCK.aradcloud.com/6',
    tracesSampleRate: 1.0
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useLogger(SentryService.SentryServiceInstance());
  const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
  });
  function foo() {
    throw new Error('😀')
  }
  const t = Sentry.getCurrentHub()
  console.log(Sentry.getCurrentHub(), '😋');
  setTimeout(() => {
    try {
      foo()
      console.log('😑');
    } catch (e) {
      console.log('&%');
      Sentry.captureException(e);
    } finally {
      console.log('😪');
      transaction.finish();
    }
  }, 99);
  const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new SentryFilter(httpAdapter));
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
