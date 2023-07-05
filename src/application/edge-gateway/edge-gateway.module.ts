import { Module } from '@nestjs/common';
import { EdgeGatewayController } from './edge-gateway.controller';
import { EdgeGatewayService } from './edge-gateway.service';

@Module({
  controllers: [EdgeGatewayController],
  providers: [EdgeGatewayService]
})
export class EdgeGatewayModule {}
