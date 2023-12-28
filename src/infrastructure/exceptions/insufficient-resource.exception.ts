import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientResourceException extends HttpException {
  constructor(message = 'insufficient resource', cause?: Error) {
    super(
      {
        status: 427,
        error: message,
      },
      HttpStatus.FORBIDDEN,
      {
        cause: cause,
      },
    );
  }
}
