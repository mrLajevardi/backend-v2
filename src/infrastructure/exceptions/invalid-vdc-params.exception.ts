import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidVdcParamsException extends HttpException {
  constructor(message = 'invalid vdc params', cause?: Error) {
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
