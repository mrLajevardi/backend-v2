import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancessService } from './service-instances.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ServiceInstancessService', () => {
  let service: ServiceInstancessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceInstancessService],
    }).compile();

    service = module.get<ServiceInstancessService>(ServiceInstancessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
