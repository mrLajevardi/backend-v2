import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ApplicationPortProfileService', () => {
  let service: ApplicationPortProfileService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ApplicationPortProfileService],
    }).compile();

    service = module.get<ApplicationPortProfileService>(
      ApplicationPortProfileService,
    );
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
