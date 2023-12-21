import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDoesNotExistException extends HttpException {
  constructor(message = 'User Does Not Exist', cause?: Error) {
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
