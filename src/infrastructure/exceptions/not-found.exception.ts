import { HttpException, HttpStatus } from '@nestjs/common';


export class NotFoundException extends HttpException {
  constructor(message = 'Not found', cause? : Error ) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: message ,
      },
      HttpStatus.NOT_FOUND,
      {
        cause: cause
      }
    );
  }
}
