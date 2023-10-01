import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAdminService } from '../services/service-admin.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { CrudModule } from '../../crud/crud.module';
import { ServiceService } from '../services/service.service';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { ExtendServiceService } from '../services/extend-service.service';
import { PaymentModule } from 'src/application/payment/payment.module';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { AbilityModule } from '../../security/ability/ability.module';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { ServiceServiceFactory } from '../Factory/service.service.factory';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { DatacenterModule } from '../../datacenter/datacenter.module';

describe('ServiceAdminService', () => {
  let service: ServiceAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        CrudModule,
        LoggerModule,
        TasksModule,
        SessionsModule,
        VgpuModule,
        PaymentModule,
        ServicePropertiesModule,
        MainWrapperModule,
        DatacenterModule
      ],
      providers: [ServiceAdminService, ServiceService, ExtendServiceService,VdcService,ServiceServiceFactory,VdcFactoryService],
    }).compile();

    service = module.get<ServiceAdminService>(ServiceAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
