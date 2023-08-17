import { Test, TestingModule } from '@nestjs/testing';
import { UvDeskEndpointsService } from './uv-desk-endpoints.service';

describe('UvDeskEndpointsService', () => {
  let service: UvDeskEndpointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UvDeskEndpointsService],
    }).compile();

    service = module.get<UvDeskEndpointsService>(UvDeskEndpointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
