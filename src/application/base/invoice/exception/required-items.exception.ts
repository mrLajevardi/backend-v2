import { HttpException, HttpStatus } from '@nestjs/common';

export class RequiredItemNotSatisfiedException extends HttpException {
  constructor(message = `required items not provided`, cause?: Error) {
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
