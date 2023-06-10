import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUseRequestPerMonthException extends HttpException {
  constructor(message = 'use more than RequestPerMonth', cause?: Error) {
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
