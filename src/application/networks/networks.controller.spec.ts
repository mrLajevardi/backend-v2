import { Test, TestingModule } from '@nestjs/testing';
import { NetworksController } from './networks.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { DhcpService } from './dhcp.service';
import { NetworksService } from './networks.service';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';
import { forwardRef } from '@nestjs/common';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';

describe('NetworksController', () => {
  let controller: NetworksController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        LoggerModule,
        ServicePropertiesModule,
        SessionsModule,
        CrudModule,
        forwardRef(() => ServiceModule),
        MainWrapperModule,
      ],
      providers: [NetworksService, DhcpService],
      controllers: [NetworksController],
    }).compile();

    controller = module.get<NetworksController>(NetworksController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
