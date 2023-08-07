import { Inject, Injectable } from '@nestjs/common';
import { Wrapper } from 'src/wrappers/newWrapper';
import { VcloudWrapperInterface } from '../interface/vcloud-wrapper.interface';
import * as https from 'https';
import * as _ from 'lodash';

@Injectable()
export class VcloudWrapperService extends Wrapper<VcloudWrapperInterface> {
  constructor(
    @Inject('VCLOUD_WRAPPER')
    private readonly vcloudWrapper: VcloudWrapperInterface,
  ) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    super(httpsAgent, vcloudWrapper, 'https://labvpc.aradcloud.com');
  }
}
