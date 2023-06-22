import { HttpException, HttpStatus } from '@nestjs/common';

export class NoIpIsAssignedException extends HttpException {
  constructor(
    message = 'no ip is assigned to this virtual data center',
    cause?: Error,
  ) {
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
