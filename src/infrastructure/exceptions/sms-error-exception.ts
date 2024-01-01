import { HttpException, HttpStatus } from '@nestjs/common';

export class SmsErrorException extends HttpException {
  constructor(message = 'Sms error exception', cause?: Error) {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: message,
      },
      HttpStatus.UNAUTHORIZED,
      {
        cause: cause,
      },
    );
  }
}
