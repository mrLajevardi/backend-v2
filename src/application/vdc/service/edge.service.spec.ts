import { Test, TestingModule } from '@nestjs/testing';
import { EdgeService } from './edge.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { VdcService } from './vdc.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { OrganizationModule } from 'src/application/base/organization/organization.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { NetworkService } from './network.service';
import { OrgService } from './org.service';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { VdcFactoryService } from './vdc.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';

describe('EdgeService', () => {
  let service: EdgeService;

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
        MainWrapperModule,
      ],
      providers: [
        VdcService,
        OrgService,
        EdgeService,
        NetworkService,
        VdcFactoryService,
      ],
    }).compile();

    service = module.get<EdgeService>(EdgeService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
