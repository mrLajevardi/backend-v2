import { HttpException, HttpStatus } from '@nestjs/common';

export class vgpuPcNamePassRequired extends HttpException {
  constructor(message = 'pcName and pcPassword is required', cause?: Error) {
    super(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: message,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
      {
        cause: cause,
      },
    );
  }
}
