import { HttpException, HttpStatus } from '@nestjs/common';

export class WrapperErrorException extends HttpException {
  constructor(message = 'wrapper error', cause?: Error) {
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
