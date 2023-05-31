import { HttpException, HttpStatus } from '@nestjs/common';


export class DisabledUserException extends HttpException {
  constructor(message = 'user is disabled', cause: Error ) {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: message,
      },
      HttpStatus.FORBIDDEN,
      {
        cause: cause,
      }
    );
  }
}
