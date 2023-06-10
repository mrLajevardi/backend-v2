import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseErrorException extends HttpException {
  constructor(message = 'database error', cause?: Error) {
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
