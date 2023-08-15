import { Test, TestingModule } from '@nestjs/testing';
import { TasksEndpointService } from './tasksEndpoint.service';

describe('TasksEndpointService', () => {
  let service: TasksEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksEndpointService],
    }).compile();

    service = module.get<TasksEndpointService>(TasksEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
