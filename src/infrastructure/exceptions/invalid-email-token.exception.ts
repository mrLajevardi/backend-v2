import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class invalidEmailToken extends HttpException {
    constructor(message = 'token is invalid', cause?: Error ) {
      super(
        {
          status: HttpStatus.BAD_REQUEST,
          error: message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: cause,
        }
      );
    }
  }
  