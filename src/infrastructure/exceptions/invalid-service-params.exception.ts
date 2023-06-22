import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidServiceParamsException extends HttpException {
  constructor(message = 'invalid service param', cause?: Error) {
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
