import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAdminController } from './service-admin.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceAdminService } from '../services/service-admin.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { CrudModule } from '../../crud/crud.module';
import { ServiceService } from '../services/service.service';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { DeleteServiceService } from '../services/delete-service.service';
import { ExtendServiceService } from '../services/extend-service.service';
import { PaymentModule } from 'src/application/payment/payment.module';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { AbilityModule } from '../../security/ability/ability.module';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { ServiceServiceFactory } from '../Factory/service.service.factory';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { DatacenterModule } from '../../datacenter/datacenter.module';
import { UserModule } from '../../user/user.module';
import { EdgeGatewayModule } from '../../../edge-gateway/edge-gateway.module';

describe('ServiceAdminController', () => {
  let controller: ServiceAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        CrudModule,
        SessionsModule,
        TasksModule,
        LoggerModule,
        PaymentModule,
        VgpuModule,
        ServicePropertiesModule,
        MainWrapperModule,
        DatacenterModule,
        UserModule,
        EdgeGatewayModule,
      ],
      providers: [
        ServiceAdminService,
        ServiceService,
        ExtendServiceService,
        DeleteServiceService,
        VdcService,
        ServiceServiceFactory,
        VdcFactoryService,
      ],
      controllers: [ServiceAdminController],
    }).compile();

    controller = module.get<ServiceAdminController>(ServiceAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
