import { HttpException, HttpStatus } from '@nestjs/common';

export class MaxAvailableServiceException extends HttpException {
  constructor(message = 'you hit your max available service', cause?: Error) {
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
