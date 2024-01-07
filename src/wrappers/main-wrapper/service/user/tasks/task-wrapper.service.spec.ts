import { TaskWrapperService } from './task-wrapper.service';
import { TestBed } from '@automock/jest';

describe('TaskWrapperService', () => {
  let service: TaskWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TaskWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
