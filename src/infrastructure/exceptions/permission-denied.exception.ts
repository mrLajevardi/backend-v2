import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base/base-exception';

export class PermissionDeniedException extends BaseException {
  constructor(message = 'common.messages.permissionDenied', cause?: Error) {
    super(message, HttpStatus.FORBIDDEN, cause);
  }
}
