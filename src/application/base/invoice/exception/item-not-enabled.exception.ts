import { HttpException, HttpStatus } from '@nestjs/common';

export class ItemNotEnabledException extends HttpException {
  constructor(message = 'item is not enabled', cause?: Error) {
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
