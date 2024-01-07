import { TestBed } from '@automock/jest';
import { TemplatesTableService } from './templates-table.service';

describe('TemplatesTableService', () => {
  let service: TemplatesTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TemplatesTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
