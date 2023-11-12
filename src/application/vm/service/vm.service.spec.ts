import { Test, TestingModule } from '@nestjs/testing';
import { VmService } from './vm.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { NetworksModule } from '../../networks/networks.module';
import { VmDetailService } from './vm-detail.service';
import { MainWrapperModule } from '../../../wrappers/main-wrapper/main-wrapper.module';
import { VmDetailFactoryService } from './vm-detail.factory.service';

describe('VmService', () => {
  let service: VmService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        LoggerModule,
        ServicePropertiesModule,
        SessionsModule,
        CrudModule,
        NetworksModule,
        MainWrapperModule,
      ],
      providers: [VmService,VmDetailFactoryService, VmDetailService],
    }).compile();

    service = module.get<VmService>(VmService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
