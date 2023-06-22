import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentRequiredException extends HttpException {
  constructor(message = 'Payment Required', cause?: Error) {
    super(
      {
        status: HttpStatus.PAYMENT_REQUIRED,
        error: message,
      },
      HttpStatus.PAYMENT_REQUIRED,
      {
        cause: cause,
      },
    );
  }
}
