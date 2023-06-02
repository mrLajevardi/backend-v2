import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class invalidToken extends HttpException {
    constructor(message = 'invalid Token', cause? : Error) {
      super(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          cause: cause,
        }
      );
    }
  }
  