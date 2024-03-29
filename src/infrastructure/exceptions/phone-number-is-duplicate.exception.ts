import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class PhoneNumberIsDuplicateException extends BaseException {
  constructor(
    message = 'common.messages.phoneNumberIsDuplicateWithOld',
    cause?: Error,
  ) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
