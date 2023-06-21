import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [GroupsService],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
