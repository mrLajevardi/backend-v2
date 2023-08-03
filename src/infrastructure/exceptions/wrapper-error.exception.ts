import { HttpException, HttpStatus } from '@nestjs/common';

export class WrapperErrorException extends HttpException {
  constructor(status: number, message: string, stack, code?: string) {
    super(
      {
        status: status,
        message,
        stack,
        code,
      },
      status,
    );
  }
}
