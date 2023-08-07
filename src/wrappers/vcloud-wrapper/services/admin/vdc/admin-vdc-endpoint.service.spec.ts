import { Test, TestingModule } from '@nestjs/testing';
import { AdminVdcEndpointService } from './admin-vdc-endpoint.service';

describe('AdminVdcEndpointService', () => {
  let service: AdminVdcEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminVdcEndpointService],
    }).compile();

    service = module.get<AdminVdcEndpointService>(AdminVdcEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
