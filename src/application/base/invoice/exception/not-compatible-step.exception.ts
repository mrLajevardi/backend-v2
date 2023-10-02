import { HttpException, HttpStatus } from '@nestjs/common';

export class NotCompatibleWithStepException extends HttpException {
  constructor(
    message = 'item value is not compatible with items step config',
    cause?: Error,
  ) {
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
