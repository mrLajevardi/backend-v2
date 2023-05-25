import { Test, TestingModule } from '@nestjs/testing';
import { AclService } from './acl.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('AclService', () => {
  let service: AclService;
  let testDataService : TestDataService; 
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
      ],
      providers: [
        AclService,
        TestDataService
      ],
    }).compile();

    service = module.get<AclService>(AclService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();

  });



  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return more than 0 ', async () => {
    const result = await service.findAll(); 
    expect(result.length).toBeGreaterThan(0);
  })
});
