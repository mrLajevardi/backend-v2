import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIpParamException extends HttpException {
  constructor(message = 'invalid ip params', cause?: Error) {
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
