import { Test, TestingModule } from '@nestjs/testing';
import { TaskAdminController } from './task-admin.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { TaskAdminService } from '../service/task-admin.service';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { SessionsModule } from '../../sessions/sessions.module';

describe('TaskAdminController', () => {
  let controller: TaskAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        ServicePropertiesModule,
        SessionsModule
      ],
      controllers: [TaskAdminController],
      providers: [TaskAdminService]
    }).compile();

    controller = module.get<TaskAdminController>(TaskAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
