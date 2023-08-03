import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAdminService } from './service-admin.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServiceInstancesTableModule } from '../../crud/service-instances-table/service-instances-table.module';
import { SessionsModule } from '../../sessions/sessions.module';

describe('ServiceAdminService', () => {
  let service: ServiceAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, 
        ServiceInstancesTableModule,
        LoggerModule,
        SessionsModule
      ],
      providers: [ServiceAdminService],
    }).compile();

    service = module.get<ServiceAdminService>(ServiceAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
