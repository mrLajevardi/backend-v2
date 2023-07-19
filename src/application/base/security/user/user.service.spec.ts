import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
