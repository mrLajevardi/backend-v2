import { Test, TestingModule } from '@nestjs/testing';
import { TaskWrapperService } from './task-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('TaskWrapperService', () => {
  let service: TaskWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [TaskWrapperService],
    }).compile();

    service = module.get<TaskWrapperService>(TaskWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
