import { HttpException, HttpStatus } from '@nestjs/common';

export class OtpNotMatchException extends HttpException {
  constructor(message = 'Error otp not matching', cause?: Error) {
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
