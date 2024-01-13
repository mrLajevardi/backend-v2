import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIsNotActiveException extends HttpException {
  constructor(message = 'user is not active', cause?: Error) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: message,
      },
      HttpStatus.BAD_REQUEST,
      {
        cause: cause,
      },
    );
  }
}
