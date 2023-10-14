import { Test, TestingModule } from '@nestjs/testing';
import { NetworkService } from './network.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { VdcService } from './vdc.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { EdgeService } from './edge.service';
import { OrganizationModule } from 'src/application/base/organization/organization.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OrgService } from './org.service';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { VdcFactoryService } from './vdc.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { DatacenterModule } from 'src/application/base/datacenter/datacenter.module';

describe('NetworkService', () => {
  let service: NetworkService;

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
        DatacenterModule,
        UserModule,
        ServiceModule,
        MainWrapperModule,
        ServicePropertiesModule,
      ],
      providers: [
        VdcService,
        OrgService,
        EdgeService,
        NetworkService,
        VdcFactoryService,
      ],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
