import { TasksService } from './tasks.service';
import { TestBed } from '@automock/jest';

describe('TasksService', () => {
  let service: TasksService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TasksService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
