import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class PasswordIsDuplicateException extends BaseException {
  constructor(
    message = 'common.messages.passwordIsDuplicateWithOld',
    cause?: Error,
  ) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
