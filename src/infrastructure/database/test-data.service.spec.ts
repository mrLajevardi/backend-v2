import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestDataService } from './test-data.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestDatabaseModule } from './test-database.module';
// Import other test entities...

import { Acl } from './test-entities/Acl';

describe('TestDataService', () => {
  let testDataService: TestDataService;
  let aclRepository: Repository<Acl>;
  // Define other repository variables...

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [TestDataService],
    }).compile();

    testDataService = module.get<TestDataService>(TestDataService);
    aclRepository = module.get<Repository<Acl>>(getRepositoryToken(Acl));
    // Initialize other repository variables...
  });

  describe('seedTestData', () => {
    // it('should insert contents in the db', async () => {
    //    // testDataService.seedTestData();
    //     await testDataService.seedTable('acl.json',aclRepository);
    //     const data = await aclRepository.find({});
    //     expect(data.length).toBeGreaterThan(0);
    // })

    it('should insert contents in the db', async () => {
      // testDataService.seedTestData();
      await testDataService.seedTestData();
      const data = await aclRepository.find({});
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
