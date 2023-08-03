import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAdminController } from './service-admin.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceAdminService } from '../services/service-admin.service';
import { ServiceInstancesTableModule } from '../../crud/service-instances-table/service-instances-table.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { CrudModule } from '../../crud/crud.module';
import { ServiceService } from '../services/service.service';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { DeleteServiceService } from '../services/delete-service.service';
import { ExtendServiceService } from '../services/extend-service.service';
import { PaymentModule } from 'src/application/payment/payment.module';

describe('ServiceAdminController', () => {
  let controller: ServiceAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        SessionsModule,
        TasksModule,
        LoggerModule,
        PaymentModule,
        VgpuModule,
      ],
      providers: [
        ServiceAdminService, 
        ServiceService,
        ExtendServiceService,
        DeleteServiceService,
        
      ],
      controllers: [ServiceAdminController],
    }).compile();

    controller = module.get<ServiceAdminController>(ServiceAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
