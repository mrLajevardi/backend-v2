import { FileController } from './file.controller';
import { TestBed } from '@automock/jest';

describe('FileController', () => {
  let controller: FileController;

  beforeAll(async () => {
    const { unit } = TestBed.create(FileController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
