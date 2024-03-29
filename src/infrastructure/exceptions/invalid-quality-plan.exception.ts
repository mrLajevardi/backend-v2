import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidQualityPlanException extends HttpException {
  constructor(message = 'invalid plan', cause?: Error) {
    super(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: message,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
      {
        cause: cause,
      },
    );
  }
}
