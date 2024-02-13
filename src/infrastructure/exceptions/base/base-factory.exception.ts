import { HttpException, Injectable } from '@nestjs/common';
import { BaseException } from './base-exception';
import { I18nService } from 'nestjs-i18n';
import { TranslateOptions } from 'nestjs-i18n/dist/services/i18n.service';
import { BaseExceptionType } from '../../types/base-exception.type';

@Injectable()
export class BaseFactoryException {
  constructor(private readonly i18n: I18nService) {}

  throwIt(exception: BaseException) {
    throw new HttpException(
      {
        status: exception.statusCode,
        error: this.i18n.t(
          exception.message,
          exception.translateOptions ?? undefined,
        ),
      },
      exception.statusCode,
      {
        cause: exception.cause,
      },
    );
  }

  handle(exception: BaseExceptionType, message?: string) {
    const exceptionObj = new exception(message ?? undefined);

    return this.throwIt(exceptionObj);
  }
  handleWithArgs(
    exception: new (name: string) => BaseException,
    translationOptions?: TranslateOptions,
    message?: string,
  ) {
    const exceptionObj = new exception(message ?? undefined);

    exceptionObj.translateOptions = translationOptions;

    return this.throwIt(exceptionObj);
  }
}
