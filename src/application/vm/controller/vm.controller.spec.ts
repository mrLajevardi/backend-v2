import { Test, TestingModule } from '@nestjs/testing';
import { VmController } from './vm.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { VmService } from '../service/vm.service';
describe('VmController', () => {
  let controller: VmController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        LoggerModule,
        ServiceModule,
        SessionsModule,
        CrudModule,
      ],
      providers: [VmService],
      controllers: [VmController],
    }).compile();

    controller = module.get<VmController>(VmController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
