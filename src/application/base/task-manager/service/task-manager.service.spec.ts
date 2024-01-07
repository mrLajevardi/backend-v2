import { TaskManagerService } from './task-manager.service';
import { TestBed } from '@automock/jest';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TaskManagerService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
