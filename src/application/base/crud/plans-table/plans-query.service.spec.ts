import { Test, TestingModule } from '@nestjs/testing';
import { PlansQueryService } from './plans-query.service';

describe('PlansQueryService', () => {
  let service: PlansQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlansQueryService],
    }).compile();

    service = module.get<PlansQueryService>(PlansQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
