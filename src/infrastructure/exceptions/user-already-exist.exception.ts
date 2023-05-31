import { HttpException, HttpStatus } from '@nestjs/common';
  
  export class userAlreadyExist extends HttpException {
    constructor(message = 'User Already Exist', cause : Error ) {
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
  