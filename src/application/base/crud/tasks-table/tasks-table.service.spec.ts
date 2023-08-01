import { Test, TestingModule } from '@nestjs/testing';
import { TasksTableService } from './tasks-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('TasksTableService', () => {
  let service: TasksTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [TasksTableService, TestDataService],
    }).compile();

    service = module.get<TasksTableService>(TasksTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
