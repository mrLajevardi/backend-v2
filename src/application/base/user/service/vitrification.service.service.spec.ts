import { Test, TestingModule } from '@nestjs/testing';
import { VitrificationServiceService } from './vitrification.service.service';

describe('VitrificationServiceService', () => {
  let service: VitrificationServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VitrificationServiceService],
    }).compile();

    service = module.get<VitrificationServiceService>(
      VitrificationServiceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
