import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DeleteServiceService } from '../services/delete-service.service';
import { CreateServiceService } from '../services/create-service.service';
import { CrudModule } from '../../crud/crud.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { UserModule } from '../../user/user.module';
import { ExtendServiceService } from '../services/extend-service.service';
import { ServiceService } from '../services/service.service';
import { PaymentModule } from 'src/application/payment/payment.module';
import { TasksModule } from '../../tasks/tasks.module';
import { ServiceAdminService } from '../services/service-admin.service';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { AbilityModule } from '../../security/ability/ability.module';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { ServiceServiceFactory } from '../Factory/service.service.factory';
import { DatacenterModule } from '../../datacenter/datacenter.module';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { TaskManagerModule } from '../../task-manager/task-manager.module';
import { EdgeGatewayModule } from '../../../edge-gateway/edge-gateway.module';
import { UvdeskWrapperModule } from 'src/wrappers/uvdesk-wrapper/uvdesk-wrapper.module';
import { InvoicesModule } from '../../invoice/invoices.module';
import { VmModule } from '../../../vm/vm.module';

describe('ServiceController', () => {
  let controller: ServiceController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        CrudModule,
        SessionsModule,
        TasksModule,
        LoggerModule,
        PaymentModule,
        VgpuModule,
        UserModule,
        ServicePropertiesModule,
        MainWrapperModule,
        DatacenterModule,
        TaskManagerModule,
        EdgeGatewayModule,
        UvdeskWrapperModule,
        InvoicesModule,
        VmModule,
      ],
      providers: [
        ServiceAdminService,
        ServiceService,
        ExtendServiceService,
        DeleteServiceService,
        CreateServiceService,
        VdcService,
        VdcFactoryService,
        ServiceServiceFactory,
      ],
      controllers: [ServiceController],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
