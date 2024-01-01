import { HttpException, HttpStatus } from '@nestjs/common';

export class OtpErrorException extends HttpException {
  constructor(message = 'Error generating otp', cause?: Error) {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: cause,
      },
    );
  }
}
