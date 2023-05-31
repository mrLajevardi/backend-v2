import { HttpException, HttpStatus } from '@nestjs/common';


export class ConflictException extends HttpException {
  constructor(message = 'The request could not be processed because of conflict in the request', cause : Error ) {
    super(
      {
        status: HttpStatus.CONFLICT,
        error: message,
      },
      HttpStatus.CONFLICT,
      {
        cause: cause 
      }
    );
  }
}
