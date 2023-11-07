import { Test, TestingModule } from '@nestjs/testing';
import { NatController } from './nat.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { NatService } from './nat.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServiceModule } from '../base/service/service.module';
import { CrudModule } from '../base/crud/crud.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';

describe('NatController', () => {
  let controller: NatController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        LoggerModule,
        ServicePropertiesModule,
        SessionsModule,
        CrudModule,
        MainWrapperModule,
      ],
      providers: [NatService],
      controllers: [NatController],
    }).compile();

    controller = module.get<NatController>(NatController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
