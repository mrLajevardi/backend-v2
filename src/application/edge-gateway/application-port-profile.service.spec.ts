import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileService } from './application-port-profile.service';

describe('ApplicationPortProfileService', () => {
  let service: ApplicationPortProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationPortProfileService],
    }).compile();

    service = module.get<ApplicationPortProfileService>(ApplicationPortProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
