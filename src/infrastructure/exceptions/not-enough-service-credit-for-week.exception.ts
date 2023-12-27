import { HttpException, HttpStatus } from '@nestjs/common';

export class NotEnoughServiceCreditForWeekException extends HttpException {
  constructor(message = 'not enough service credit for a week', cause?: Error) {
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
