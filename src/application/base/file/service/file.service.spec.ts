import { FileService } from './file.service';
import { TestBed } from '@automock/jest';

describe('FileService', () => {
  let service: FileService;

  beforeAll(async () => {
    const { unit } = TestBed.create(FileService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
