import { Test, TestingModule } from '@nestjs/testing';
import { TicketingWrapperService } from './ticketing-wrapper.service';
import { UvDeskWrapperService } from '../uv-desk-wrapper.service';
import { ConfigModule } from '@nestjs/config';
import { UvDeskEndpointsService } from '../endpoints/uv-desk-endpoints.service';

describe('TicketingWrapperService', () => {
  let service: TicketingWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        TicketingWrapperService,
        UvDeskWrapperService,
        UvDeskEndpointsService,
      ],
    }).compile();

    service = module.get<TicketingWrapperService>(TicketingWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
