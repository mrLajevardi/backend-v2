import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class invalidServiceInstanceID extends HttpException {
    constructor(message = 'invalid serviceinstance ID', cause? : Error) {
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
  