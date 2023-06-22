import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUsernameException extends HttpException {
  constructor(message = 'Unauthorized request', cause?: Error) {
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
