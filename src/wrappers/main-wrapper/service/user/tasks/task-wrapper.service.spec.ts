import { Test, TestingModule } from '@nestjs/testing';
import { TaskWrapperService } from './task-wrapper.service';

describe('TaskWrapperService', () => {
  let service: TaskWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskWrapperService],
    }).compile();

    service = module.get<TaskWrapperService>(TaskWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
