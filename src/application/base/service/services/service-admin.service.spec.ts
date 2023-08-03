import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAdminService } from './service-admin.service';

describe('ServiceAdminService', () => {
  let service: ServiceAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceAdminService],
    }).compile();

    service = module.get<ServiceAdminService>(ServiceAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
