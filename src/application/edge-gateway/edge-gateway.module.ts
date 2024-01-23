import { Module } from '@nestjs/common';
import { EdgeGatewayController } from './controller/edge-gateway.controller';
import { EdgeGatewayService } from './service/edge-gateway.service';
import { ApplicationPortProfileService } from './service/application-port-profile.service';
import { FirewallService } from './service/firewall.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { OrganizationTableModule } from '../base/crud/organization-table/organization-table.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { StaticRouteService } from './service/static-route.service';
import { BaseExceptionModule } from '../../infrastructure/exceptions/base/base-exception.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    SessionsModule,
    CrudModule,
    ServicePropertiesModule,
    MainWrapperModule,
    BaseExceptionModule,
  ],
  controllers: [EdgeGatewayController],
  providers: [
    EdgeGatewayService,
    ApplicationPortProfileService,
    FirewallService,
    StaticRouteService,
  ],
  exports: [EdgeGatewayService, FirewallService, ApplicationPortProfileService],
})
export class EdgeGatewayModule {}
