import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class OtpNotMatchException extends BaseException {
  constructor(message = 'auth.messages.otpNotMatch', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
