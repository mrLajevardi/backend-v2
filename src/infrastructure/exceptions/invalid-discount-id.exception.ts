import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDiscountIdException extends HttpException {
  constructor(message = 'invalid discount id', cause?: Error) {
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
