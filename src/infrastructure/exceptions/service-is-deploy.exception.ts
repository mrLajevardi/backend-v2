import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceIsDeployException extends HttpException {
  constructor(message = 'service is power on', cause?: Error) {
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
