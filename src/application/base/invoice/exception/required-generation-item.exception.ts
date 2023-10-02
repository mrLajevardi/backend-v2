import { HttpException, HttpStatus } from '@nestjs/common';

export class RequiredGenerationItemNotSatisfiedException extends HttpException {
  constructor(
    message = `required generation items not provided`,
    cause?: Error,
  ) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: message,
      },
      HttpStatus.BAD_REQUEST,
      {
        cause: cause,
      },
    );
  }
}
