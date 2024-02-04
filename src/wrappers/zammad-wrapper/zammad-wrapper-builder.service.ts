import { Injectable } from '@nestjs/common';
import { WrapperBuilder } from '../class/wrapper-builder';
import { WrapperBuilderInterface } from '../interfaces/wrapper-builder.interface';

@Injectable()
export class ZammadWrapperBuilderService
  extends WrapperBuilder
  implements WrapperBuilderInterface
{
  setDefault(): this {
    this.setBaseUrl(process.env.ZAMMAD_BASE_URL);
    this.setException((err: Error) => {
      console.log('zammad error:', err);
      return Promise.reject(new Error(err.message));
    });
    return this;
  }
}
