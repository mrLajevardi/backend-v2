import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class NotEnoughCreditException extends BaseException {
  constructor(message = 'messages.userNotHaveEnoughCredit', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
