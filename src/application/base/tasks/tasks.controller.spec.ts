import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
