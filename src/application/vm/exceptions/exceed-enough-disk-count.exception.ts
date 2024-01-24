import { BaseHttpException } from '../../../infrastructure/exceptions/base-http-exception';
import { HttpStatus } from '@nestjs/common';

export class ExceedEnoughDiskCountException extends BaseHttpException {
  constructor(message = 'ExceedEnoughDiskCountException', cause?: Error) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: message,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
      {
        cause: cause,
      },
    );
  }
}
