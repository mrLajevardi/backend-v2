import { HttpException, HttpStatus } from '@nestjs/common';


export class BadRequestException extends HttpException {
  constructor(message='bad request', cause: Error ) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: message,
      },
      HttpStatus.BAD_REQUEST,
      {
        cause: cause
      }
    );
  }
}
