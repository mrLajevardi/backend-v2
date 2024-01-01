import { HttpException, HttpStatus } from '@nestjs/common';

export class VcloudErrorException extends HttpException {
  constructor(message = 'Error in vcloud connection', cause?: Error) {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: cause,
      },
    );
  }
}
