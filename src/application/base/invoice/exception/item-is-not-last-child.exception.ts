import { HttpException, HttpStatus } from '@nestjs/common';

export class ItemIsNotLastChildException extends HttpException {
  constructor(message = 'item is not last child', cause?: Error) {
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
