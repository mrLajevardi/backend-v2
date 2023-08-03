import { Test, TestingModule } from '@nestjs/testing';
import { NetworksService } from './networks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { DhcpService } from './dhcp.service';

describe('NetworksService', () => {
  let service: NetworksService;

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

    service = module.get<NetworksService>(NetworksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
