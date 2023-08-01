import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('OauthService', () => {
  let service: OauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [OauthService],
    }).compile();

    service = module.get<OauthService>(OauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
