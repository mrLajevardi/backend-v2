import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidServiceIdException extends HttpException {
  constructor(message = 'invalid service id', cause?: Error) {
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
