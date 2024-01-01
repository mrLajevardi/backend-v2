import { Test, TestingModule } from '@nestjs/testing';
import { UvDeskWrapperService } from './uv-desk-wrapper.service';
import { UvDeskEndpointsService } from './endpoints/uv-desk-endpoints.service';
import { ConfigModule } from '@nestjs/config';

describe('UvDeskWrapperService', () => {
  let service: UvDeskWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [UvDeskWrapperService, UvDeskEndpointsService],
    }).compile();

    service = module.get<UvDeskWrapperService>(UvDeskWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
