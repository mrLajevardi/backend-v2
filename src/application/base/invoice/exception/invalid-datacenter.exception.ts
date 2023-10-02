import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDatacenterException extends HttpException {
  constructor(message = 'invalid datacenter', cause?: Error) {
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
