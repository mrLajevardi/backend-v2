import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAdminController } from './service-admin.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceAdminService } from '../services/service-admin.service';
import { ServiceInstancesTableModule } from '../../crud/service-instances-table/service-instances-table.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SessionsModule } from '../../sessions/sessions.module';

describe('ServiceAdminController', () => {
  let controller: ServiceAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, 
        ServiceInstancesTableModule,
        LoggerModule,
        SessionsModule
      ],
      providers: [ServiceAdminService],
      controllers: [ServiceAdminController],
    }).compile();

    controller = module.get<ServiceAdminController>(ServiceAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
