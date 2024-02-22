import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class PaymentGatewayException extends BaseException {
  constructor(message = 'payment.messages.gatewayGetDataError', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
