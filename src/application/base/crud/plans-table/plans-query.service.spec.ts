import { Test, TestingModule } from '@nestjs/testing';
import { PlansQueryService } from './plans-query.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('PlansQueryService', () => {
  let service: PlansQueryService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PlansQueryService],
    }).compile();

    service = module.get<PlansQueryService>(PlansQueryService);
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
