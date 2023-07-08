import { Module } from '@nestjs/common';
import { EdgeGatewayController } from './edge-gateway.controller';
import { EdgeGatewayService } from './edge-gateway.service';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { FirewallService } from './firewall.service';

@Module({
  controllers: [EdgeGatewayController],
  providers: [
    EdgeGatewayService,
    ApplicationPortProfileService,
    FirewallService,
  ],
})
export class EdgeGatewayModule {}
