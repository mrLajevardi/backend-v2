import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import * as Sentry from '@sentry/node';
import * as process from 'process';
import { SentryFilter } from './infrastructure/exceptions/sentry-exception-filter';
import { LogLevel } from '@sentry/types';
import { SentryInterceptor } from './infrastructure/logger/Interceptors/SentryInterceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  Sentry.init({
    dsn: process.env.DSN_SENTRY,
    debug: true,
    logLevel: LogLevel.Verbose,
  });

  const config = new DocumentBuilder()
    .setTitle('Arad API')
    .setDescription('Arad api swagger test ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({ validateCustomDecorators: true, transform: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));
  app.useGlobalInterceptors(new SentryInterceptor());
  await app.listen(process.env.PORT);
}

bootstrap();
