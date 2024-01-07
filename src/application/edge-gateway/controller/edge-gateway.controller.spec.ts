import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayController } from './edge-gateway.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ApplicationPortProfileService } from '../service/application-port-profile.service';
import { EdgeGatewayService } from '../service/edge-gateway.service';
import { FirewallService } from '../service/firewall.service';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { createMock } from '@golevelup/ts-jest';
import { TestBed } from '@automock/jest';

describe('EdgeGatewayController', () => {
  let controller: EdgeGatewayController;

  beforeAll(async () => {
    const { unit } = TestBed.create(EdgeGatewayController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
