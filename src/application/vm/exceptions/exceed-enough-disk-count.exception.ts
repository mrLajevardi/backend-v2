import { BaseHttpException } from '../../../infrastructure/exceptions/base-http-exception';
import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../../infrastructure/exceptions/base/base-exception';
import { TranslateOptions } from 'nestjs-i18n/dist/services/i18n.service';

export class ExceedEnoughDiskCountException extends BaseException {
  // constructor(message = 'ExceedEnoughDiskCountException', cause?: Error) {
  //   super(
  //     {
  //       status: HttpStatus.BAD_REQUEST,
  //       error: message,
  //     },
  //     HttpStatus.UNPROCESSABLE_ENTITY,
  //     {
  //       cause: cause,
  //     },
  //   );
  // }

  constructor(
    message = 'messages.exceedEnoughBusType',
    cause?: Error,
    translationOption?: TranslateOptions,
  ) {
    super(message, HttpStatus.BAD_REQUEST, cause, translationOption);
  }
}
