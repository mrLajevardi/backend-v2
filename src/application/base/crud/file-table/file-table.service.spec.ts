import { FileTableService } from './file-table.service';
import { TestBed } from '@automock/jest';

describe('FileTableService', () => {
  let service: FileTableService;

  beforeEach(async () => {
    const { unit } = TestBed.create(FileTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
