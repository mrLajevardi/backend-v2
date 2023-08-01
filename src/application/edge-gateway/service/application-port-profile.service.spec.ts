import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ApplicationPortProfileService', () => {
  let service: ApplicationPortProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ApplicationPortProfileService],
    }).compile();

    service = module.get<ApplicationPortProfileService>(
      ApplicationPortProfileService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
