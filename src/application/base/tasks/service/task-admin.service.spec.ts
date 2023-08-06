import { Test, TestingModule } from '@nestjs/testing';
import { TaskAdminService } from './task-admin.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { AbilityModule } from '../../security/ability/ability.module';

describe('TaskAdminService', () => {
  let service: TaskAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        CrudModule,
        ServicePropertiesModule,
        SessionsModule,
      ],
      providers: [TaskAdminService],
    }).compile();

    service = module.get<TaskAdminService>(TaskAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
