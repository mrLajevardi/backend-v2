import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class AiApiException extends BaseException {
  constructor(message = 'messages.aiApiNotResponse', cause?: Error) {
    super(message, HttpStatus.BAD_REQUEST, cause);
  }
}
