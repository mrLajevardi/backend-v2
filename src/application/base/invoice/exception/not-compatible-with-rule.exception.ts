import { HttpException, HttpStatus } from '@nestjs/common';

export class NotCompatibleWithRuleException extends HttpException {
  constructor(
    message = 'item value is not compatible with items rule',
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
