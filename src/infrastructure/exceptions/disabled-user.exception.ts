import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class DisabledUserException extends BaseException {
  constructor(message = 'auth.messages.userIsDeactivate', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
