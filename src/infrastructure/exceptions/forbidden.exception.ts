import { HttpException, HttpStatus } from '@nestjs/common';

export class forbidden extends HttpException {
  constructor(message = 'Forbidden Access', cause?: Error) {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: message,
      },
      HttpStatus.FORBIDDEN,
      {
        cause: cause,
      },
    );
  }
}
