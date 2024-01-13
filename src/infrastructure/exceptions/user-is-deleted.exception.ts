import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIsDeletedException extends HttpException {
  constructor(message = 'user is deleted', cause?: Error) {
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
