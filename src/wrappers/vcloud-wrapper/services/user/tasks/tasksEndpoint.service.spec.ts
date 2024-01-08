import { TasksEndpointService } from './tasksEndpoint.service';
import { TestBed } from '@automock/jest';

describe('TasksEndpointService', () => {
  let service: TasksEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TasksEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
