import { Injectable } from '@nestjs/common';
import { Wrapper } from '../../../newWrapper';
import { ZammadWrapperInterface } from '../../interface/zammad-wrapper.interface';
import * as https from 'https';

@Injectable()
export class ZammadEndpointService extends Wrapper<ZammadWrapperInterface> {
  constructor(private readonly zammadWrapper: ZammadWrapperInterface) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    super(httpsAgent, zammadWrapper, 'http://185.213.10.206:9090/');
  }
}
