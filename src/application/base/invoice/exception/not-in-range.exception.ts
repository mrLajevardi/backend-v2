import { HttpException, HttpStatus } from '@nestjs/common';

export class NotInRangeException extends HttpException {
  constructor(message = 'item value is not in correct range', cause?: Error) {
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
