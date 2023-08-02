import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DeleteServiceService } from './delete-service.service';
import { CrudModule } from '../../crud/crud.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { TaskManagerService } from '../../tasks/service/task-manager.service';

describe('DeleteServiceService', () => {
  let service: DeleteServiceService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule, 
        CrudModule, 
        SessionsModule,
        TaskManagerService
      ],
      providers: [DeleteServiceService],
    }).compile();

    service = module.get<DeleteServiceService>(DeleteServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
