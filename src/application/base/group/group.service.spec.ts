import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [GroupService],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
