import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserEndpointService } from './admin-user-endpoint.service';

describe('AdminUserEndpointService', () => {
  let service: AdminUserEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUserEndpointService],
    }).compile();

    service = module.get<AdminUserEndpointService>(AdminUserEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
