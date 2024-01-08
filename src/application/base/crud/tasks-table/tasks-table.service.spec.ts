import { TasksTableService } from './tasks-table.service';
import { TestBed } from '@automock/jest';

describe('TasksTableService', () => {
  let service: TasksTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TasksTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
