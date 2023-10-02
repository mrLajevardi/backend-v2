import { HttpException, HttpStatus } from '@nestjs/common';

export class ItemNotExistsException extends HttpException {
  constructor(message = 'item does not exist', cause?: Error) {
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
