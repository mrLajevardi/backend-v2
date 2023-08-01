import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('OauthService', () => {
  let service: OauthService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [OauthService],
    }).compile();

    service = module.get<OauthService>(OauthService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
