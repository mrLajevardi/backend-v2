import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from './create-service.service';

describe('CreateServiceService', () => {
  let service: CreateServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateServiceService],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
