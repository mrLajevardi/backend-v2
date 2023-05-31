import { HttpException, HttpStatus } from '@nestjs/common';


export class NotEnoughCreditException extends HttpException {
    constructor(message='not enough credit',cause: Error ) {
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