import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAdminService } from './service-admin.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServiceInstancesTableModule } from '../../crud/service-instances-table/service-instances-table.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { CrudModule } from '../../crud/crud.module';
import { ServiceService } from './service.service';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';

describe('ServiceAdminService', () => {
  let service: ServiceAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, 
        CrudModule,
        LoggerModule,
        TasksModule,
        SessionsModule,
        VgpuModule
      ],
      providers: [ServiceAdminService, ServiceService],
    }).compile();

    service = module.get<ServiceAdminService>(ServiceAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
