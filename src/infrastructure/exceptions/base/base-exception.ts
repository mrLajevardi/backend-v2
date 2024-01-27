import { HttpStatus } from '@nestjs/common';
import { TranslateOptions } from 'nestjs-i18n/dist/services/i18n.service';

export class BaseException {
  message: string;

  statusCode: HttpStatus;

  cause: Error;

  translateOptions: TranslateOptions;

  args: any;

  constructor(
    message = 'messages.someThingGotWrong',
    httpCode: HttpStatus,
    cause?: Error,
    translateOptions?: TranslateOptions,
  ) {
    this.message = message;
    this.statusCode = httpCode;
    this.cause = cause;
    this.translateOptions = translateOptions;
  }
}
