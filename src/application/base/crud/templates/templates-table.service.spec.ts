import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesTableService } from './templates-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('TemplatesTableService', () => {
  let service: TemplatesTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [TemplatesTableService],
    }).compile();

    service = module.get<TemplatesTableService>(TemplatesTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
