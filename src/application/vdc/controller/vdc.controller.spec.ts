import { Test, TestingModule } from '@nestjs/testing';
import { VdcController } from './vdc.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { EdgeService } from '../service/edge.service';
import { NetworkService } from '../service/network.service';
import { OrgService } from '../service/org.service';
import { VdcService } from '../service/vdc.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { OrganizationModule } from 'src/application/base/organization/organization.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { VdcFactoryService } from '../service/vdc.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';

describe('VdcController', () => {
  let controller: VdcController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        //TasksModule,
        SessionsModule,
        OrganizationModule,
        UserModule,
        ServicePropertiesModule,
        MainWrapperModule
      ],
      providers: [VdcService, OrgService, EdgeService, NetworkService,VdcFactoryService],

      controllers: [VdcController],
    }).compile();

    controller = module.get<VdcController>(VdcController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
