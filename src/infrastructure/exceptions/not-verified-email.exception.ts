import { HttpException, HttpStatus } from '@nestjs/common';

export class NotVerifiedEmailException extends HttpException {
  constructor(message = 'user email is not verified', cause?: Error) {
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
