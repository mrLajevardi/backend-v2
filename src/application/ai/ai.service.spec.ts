import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { UserService } from '../base/user/user.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AiService, UserService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
