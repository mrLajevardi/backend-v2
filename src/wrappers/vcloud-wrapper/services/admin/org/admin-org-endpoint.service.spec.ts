import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrgEndpointService } from './admin-org-endpoint.service';

describe('AdminOrgEndpointService', () => {
  let service: AdminOrgEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOrgEndpointService],
    }).compile();

    service = module.get<AdminOrgEndpointService>(AdminOrgEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
