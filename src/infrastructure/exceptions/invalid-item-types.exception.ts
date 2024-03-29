import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidItemTypesException extends HttpException {
  constructor(message = 'invalid item types', cause?: Error) {
    super(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: message,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
      {
        cause: cause,
      },
    );
  }
}
