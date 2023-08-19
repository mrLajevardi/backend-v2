import { Module } from '@nestjs/common';
import { UvDeskEndpointsService } from './service/endpoints/uv-desk-endpoints.service';
import { UvDeskWrapperService } from './service/uv-desk-wrapper.service';
import { TicketingWrapperService } from './service/wrapper/ticketing-wrapper.service';

@Module({
  providers: [
    UvDeskEndpointsService,
    UvDeskWrapperService,
    TicketingWrapperService,
  ],
})
export class UvdeskWrapperModule {}
