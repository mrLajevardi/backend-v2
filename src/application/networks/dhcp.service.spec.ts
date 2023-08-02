import { Test, TestingModule } from '@nestjs/testing';
import { DhcpService } from './dhcp.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { NetworksService } from './networks.service';

describe('DhcpService', () => {
  let service: DhcpService;

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
      providers: [NetworksService, DhcpService],
    }).compile();

    service = module.get<DhcpService>(DhcpService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
