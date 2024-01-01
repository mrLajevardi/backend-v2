import { HttpException, HttpStatus } from '@nestjs/common';

export class NotDisabledServiceException extends HttpException {
  constructor(message = 'service is not disabled', cause?: Error) {
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
