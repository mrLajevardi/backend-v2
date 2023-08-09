import { Test, TestingModule } from '@nestjs/testing';
import { QualityPlansService } from './quality-plans.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('QualityPlansService', () => {
  let service: QualityPlansService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [QualityPlansService],
    }).compile();

    service = module.get<QualityPlansService>(QualityPlansService);
  });

  afterAll(async () => {
    await module.close();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
