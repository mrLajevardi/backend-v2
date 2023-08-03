import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { EdgeGatewayService } from './edge-gateway.service';
import { FirewallService } from './firewall.service';

describe('ApplicationPortProfileService', () => {
  let service: ApplicationPortProfileService;

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
      providers: [
        EdgeGatewayService,
        ApplicationPortProfileService,
        FirewallService,
      ],
    }).compile();

    service = module.get<ApplicationPortProfileService>(
      ApplicationPortProfileService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
