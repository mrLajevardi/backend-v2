import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SessionsService],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
