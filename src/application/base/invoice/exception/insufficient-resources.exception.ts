import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientResourceException extends HttpException {
  constructor(message = 'insufficient resource for item', cause?: Error) {
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
