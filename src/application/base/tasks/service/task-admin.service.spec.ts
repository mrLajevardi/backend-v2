import { Test, TestingModule } from '@nestjs/testing';
import { TaskAdminService } from './task-admin.service';

describe('TaskAdminService', () => {
  let service: TaskAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskAdminService],
    }).compile();

    service = module.get<TaskAdminService>(TaskAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
