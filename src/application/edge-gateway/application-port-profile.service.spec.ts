import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ApplicationPortProfileService', () => {
  let service: ApplicationPortProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ApplicationPortProfileService],
    }).compile();

    service = module.get<ApplicationPortProfileService>(ApplicationPortProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
