import { Test, TestingModule } from '@nestjs/testing';
import { ServiceItemsService } from './service-items.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ServiceItemsService', () => {
  let service: ServiceItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceItemsService],
    }).compile();

    service = module.get<ServiceItemsService>(ServiceItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
