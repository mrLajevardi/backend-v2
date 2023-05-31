import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class invalidUseRequestPerDay extends HttpException {
    constructor(message = 'use more than RequestPerDay', cause : Error) {
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
  