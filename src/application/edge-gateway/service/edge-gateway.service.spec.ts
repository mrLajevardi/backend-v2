import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayService } from './edge-gateway.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { FirewallService } from './firewall.service';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';

describe('EdgeGatewayService', () => {
  let service: EdgeGatewayService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        LoggerModule,
        SessionsModule,
        CrudModule,
        ServicePropertiesModule,
      ],
      providers: [
        EdgeGatewayService,
        ApplicationPortProfileService,
        FirewallService,
      ],
    }).compile();

    service = module.get<EdgeGatewayService>(EdgeGatewayService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be contain port profile', () => {
    expect(service.applicationPortProfile).toBeDefined();
  });

  it('should be contain firewall', () => {
    expect(service.firewall).toBeDefined();
  });
});
