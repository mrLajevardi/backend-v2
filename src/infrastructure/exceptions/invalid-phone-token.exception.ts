import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class invalidPhoneToken extends HttpException {
    constructor(message = 'phone token is invalid', cause?: Error) {
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
  