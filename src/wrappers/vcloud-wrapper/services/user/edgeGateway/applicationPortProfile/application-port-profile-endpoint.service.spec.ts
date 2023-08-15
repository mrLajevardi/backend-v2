import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileEndpointService } from './application-port-profile-endpoint.service';

describe('ApplicationPortProfileEndpointService', () => {
  let service: ApplicationPortProfileEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationPortProfileEndpointService],
    }).compile();

    service = module.get<ApplicationPortProfileEndpointService>(
      ApplicationPortProfileEndpointService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
