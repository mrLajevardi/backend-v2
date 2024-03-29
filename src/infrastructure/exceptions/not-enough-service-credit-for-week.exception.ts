import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class NotEnoughServiceCreditForWeekException extends BaseException {
  constructor(message = 'common.messages.notEnoughForWeek', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
