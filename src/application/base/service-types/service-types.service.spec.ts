import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypesService } from './service-types.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ServiceTypesService', () => {
  let service: ServiceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceTypesService],
    }).compile();

    service = module.get<ServiceTypesService>(ServiceTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
