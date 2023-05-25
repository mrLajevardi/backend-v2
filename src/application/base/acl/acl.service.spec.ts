import { Test, TestingModule } from '@nestjs/testing';
import { AclService } from './acl.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/test-entities/Acl';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { Repository } from 'typeorm';
import { User } from 'src/infrastructure/database/entities/User';

describe('AclService', () => {
  let service: AclService;
  let testDataService : TestDataService; 
  let aclRepository: Repository<Acl>;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([Acl])
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
