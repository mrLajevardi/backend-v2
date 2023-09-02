import { Inject, Injectable } from '@nestjs/common';
import { Wrapper } from 'src/wrappers/newWrapper';
import { VcloudWrapperInterface } from '../interface/vcloud-wrapper.interface';
import * as https from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VcloudWrapperService extends Wrapper<VcloudWrapperInterface> {
  constructor(
    @Inject('VCLOUD_WRAPPER')
    public readonly vcloudWrapper: VcloudWrapperInterface,
    private configService: ConfigService,
  ) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    console.log(vcloudWrapper, '🍳');
    super(
      httpsAgent,
      vcloudWrapper,
      configService.get<string>('VCLOUD_BASE_URL'),
    );
    // const wrapper =
    //   this.getWrapper<'VmEndpointService.acquireVmTicketEndpoint'>(
    //     'VmEndpointService.acquireVmTicketEndpoint',
    //   );
    // await this.request(wrapper({}));
  }
}
