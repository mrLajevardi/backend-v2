import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidGenerationException extends HttpException {
  constructor(message = 'invalid generation', cause?: Error) {
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
