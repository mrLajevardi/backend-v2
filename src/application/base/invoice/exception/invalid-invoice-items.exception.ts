import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidInvoiceItemsException extends HttpException {
  constructor(message = 'invalid items', cause?: Error) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: message,
      },
      HttpStatus.BAD_REQUEST,
      {
        cause: cause,
      },
    );
  }
}
