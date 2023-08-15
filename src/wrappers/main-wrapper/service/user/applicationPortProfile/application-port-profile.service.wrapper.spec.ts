import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileWrapperService } from './application-port-profile-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('ApplicationPortProfileWrapperService', () => {
  let service: ApplicationPortProfileWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
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
