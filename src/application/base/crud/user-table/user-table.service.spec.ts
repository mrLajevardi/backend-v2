import { Test, TestingModule } from '@nestjs/testing';
import { UserTableService } from './user-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('UserTableService', () => {
  let service: UserTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UserTableService, TestDataService],
    }).compile();

    service = module.get<UserTableService>(UserTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
