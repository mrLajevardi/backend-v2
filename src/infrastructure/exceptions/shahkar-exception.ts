import { HttpException, HttpStatus } from '@nestjs/common';

export class ShahkarException extends HttpException {
  constructor(message = 'Error shahkar', cause?: Error) {
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
