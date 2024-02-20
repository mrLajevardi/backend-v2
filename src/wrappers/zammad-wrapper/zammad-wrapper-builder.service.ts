import { Injectable } from '@nestjs/common';
import { WrapperBuilder } from '../class/wrapper-builder';
import { WrapperBuilderInterface } from '../interfaces/wrapper-builder.interface';
import { WrapperErrorException } from '../../infrastructure/exceptions/wrapper-error.exception';

@Injectable()
export class ZammadWrapperBuilderService
  extends WrapperBuilder
  implements WrapperBuilderInterface
{
  setDefault(): this {
    this.setBaseUrl(process.env.ZAMMAD_BASE_URL);
    this.setException((err: any) => {
      console.log('zammad error:', err);
      return Promise.reject(
        new WrapperErrorException(
          err.response.status,
          err.response?.data?.message,
          err.stack,
          err.response?.data?.minorErrorCode,
        ),
      );
    });
    return this;
  }
}
