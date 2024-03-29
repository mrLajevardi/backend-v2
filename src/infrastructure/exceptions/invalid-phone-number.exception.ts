import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPhoneNumberException extends HttpException {
  constructor(message = 'phone is invalid', cause?: Error) {
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
