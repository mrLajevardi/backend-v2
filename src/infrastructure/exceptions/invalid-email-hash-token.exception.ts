import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class InvalidEmailHashTokenException extends BaseException {
  constructor(message = 'auth.messages.emailTokenNotMatch', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
