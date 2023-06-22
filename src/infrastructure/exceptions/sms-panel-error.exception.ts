import { HttpException, HttpStatus } from '@nestjs/common';

export class SmsPanelErrorException extends HttpException {
  constructor(message = 'sms not send', cause?: Error) {
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
