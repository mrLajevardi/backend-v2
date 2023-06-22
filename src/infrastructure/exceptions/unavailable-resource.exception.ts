import { HttpException, HttpStatus } from '@nestjs/common';

export class UnavailableResource extends HttpException {
  constructor(message = 'resource is unavailable', cause?: Error) {
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
