import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';

export class ValidationExceptionFactoryFilter extends HttpException {
  constructor(errors: ValidationError[]) {
    const formattedError: any[] = [];
    for (const error of errors) {
      Object.keys(error.constraints).map((item: any) => {
        formattedError.push({
          property: error.property,
          value: error.value ?? null,
          message: error.constraints[item],
        });
      });
    }

    super(
      {
        messages: formattedError,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
