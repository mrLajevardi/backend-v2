import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class unprocessableEntity extends HttpException {
    constructor(message = 'unprocessable entity', cause : Error) {
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
  