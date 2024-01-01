import { HttpException, HttpStatus } from '@nestjs/common';

export class AiApiException extends HttpException {
  constructor(message = 'Ai Api Request exception ', cause?: Error) {
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
