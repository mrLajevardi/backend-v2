import { HttpException, HttpStatus } from '@nestjs/common';

export class MoreThanOneUserWithSameEmail extends HttpException {
  constructor(
    message = 'More than one user existed with this email',
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
