import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class invalidExpirationCredit extends HttpException {
    constructor(message = 'Expiration of credit', cause : Error) {
      super(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: message,
        },
        HttpStatus.UNAUTHORIZED,
        {
          cause: cause,
        }
      );
    }
  }
  