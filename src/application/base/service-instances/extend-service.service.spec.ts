import { Test, TestingModule } from '@nestjs/testing';
import { ExtendServiceService } from './extend-service.service';

describe('ExtendServiceService', () => {
  let service: ExtendServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtendServiceService],
    }).compile();

    service = module.get<ExtendServiceService>(ExtendServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
