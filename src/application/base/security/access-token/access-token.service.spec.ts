import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenService } from './access-token.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('AccessTokenService', () => {
  let service: AccessTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AccessTokenService],
    }).compile();

    service = module.get<AccessTokenService>(AccessTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
