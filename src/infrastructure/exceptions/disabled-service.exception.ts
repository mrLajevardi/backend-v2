import { HttpException, HttpStatus } from '@nestjs/common';

export class DisabledServiceException extends HttpException {
  constructor(message = 'service is disabled', cause?: Error) {
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
