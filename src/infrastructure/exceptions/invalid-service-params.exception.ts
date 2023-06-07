import { HttpException, HttpStatus } from '@nestjs/common';

export class invalidServiceParams extends HttpException {
  constructor(message = 'invalid service param', cause?: Error) {
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
