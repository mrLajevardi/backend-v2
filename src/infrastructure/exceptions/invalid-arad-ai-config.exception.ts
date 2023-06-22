import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidAradAIConfigException extends HttpException {
  constructor(message = 'invalid arad ai config', cause?: Error) {
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
