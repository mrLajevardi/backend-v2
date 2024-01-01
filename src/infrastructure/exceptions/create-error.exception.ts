import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateErrorException extends HttpException {
  constructor(message = 'Error creating entity', cause?: Error) {
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
