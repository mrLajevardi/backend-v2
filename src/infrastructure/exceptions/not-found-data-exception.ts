import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class NotFoundDataException extends BaseException {
  constructor(message = 'common.messages.notFound', cause?: Error) {
    super(message, HttpStatus.NOT_FOUND, cause);
  }
}
