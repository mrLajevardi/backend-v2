import { HttpException, HttpStatus } from '@nestjs/common';

export class PersonalUnverifiedException extends HttpException {
  constructor(message = 'please verify your profile', cause?: Error) {
    super(
      {
        status: 451,
        error: message,
      },
      451,
      {
        cause: cause,
      },
    );
  }
}
