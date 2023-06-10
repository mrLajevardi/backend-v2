import { Test, TestingModule } from '@nestjs/testing';
import { GroupsMappingService } from './groups-mapping.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('GroupsMappingService', () => {
  let service: GroupsMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [GroupsMappingService],
    }).compile();

    service = module.get<GroupsMappingService>(GroupsMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
