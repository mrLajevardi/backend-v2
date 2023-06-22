import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized request', cause?: Error) {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: message,
      },
      HttpStatus.UNAUTHORIZED,
      {
        cause: cause,
      },
    );
  }
}
