import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import { Wrapper } from 'src/wrappers/newWrapper';
import { UvDeskEndpointsService } from './endpoints/uv-desk-endpoints.service';

@Injectable()
export class UvDeskWrapperService extends Wrapper<UvDeskEndpointsService> {
  constructor(
    private readonly configService: ConfigService,
    private readonly uvDeskEndpointsService: UvDeskEndpointsService,
  ) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    super(
      httpsAgent,
      uvDeskEndpointsService,
      configService.get<string>('UVDESK_BASE_URL'),
    );
  }
}
