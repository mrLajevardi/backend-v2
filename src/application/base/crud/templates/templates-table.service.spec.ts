import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesTableService } from './templates-table.service';

describe('TemplatesTableService', () => {
  let service: TemplatesTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplatesTableService],
    }).compile();

    service = module.get<TemplatesTableService>(TemplatesTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
