import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../../infrastructure/exceptions/base/base-exception';
import { TranslateOptions } from 'nestjs-i18n/dist/services/i18n.service';

export class ExceedEnoughDiskCountException extends BaseException {
  constructor(
    message = 'disk.messages.exceedEnoughBusType',
    cause?: Error,
    translationOption?: TranslateOptions,
  ) {
    super(message, HttpStatus.BAD_REQUEST, cause, translationOption);
  }
}
