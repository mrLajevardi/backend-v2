import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class ShahkarException extends BaseException {
  constructor(message = 'user.messages.personalCodeNotMatch', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
