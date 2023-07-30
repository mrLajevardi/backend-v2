import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('OauthService', () => {
  let service: OauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [OauthService],
    }).compile();

    service = module.get<OauthService>(OauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
