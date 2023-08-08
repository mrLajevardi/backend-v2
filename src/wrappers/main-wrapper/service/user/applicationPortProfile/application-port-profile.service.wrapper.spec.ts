import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileWrapperService } from './application-port-profile-wrapper.service';

describe('ApplicationPortProfileWrapperService', () => {
  let service: ApplicationPortProfileWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationPortProfileWrapperService],
    }).compile();

    service = module.get<ApplicationPortProfileWrapperService>(
      ApplicationPortProfileWrapperService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
