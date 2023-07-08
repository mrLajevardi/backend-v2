import { Module } from '@nestjs/common';
import { NetworksService } from './networks.service';
import { DhcpService } from './dhcp.service';

@Module({
  providers: [NetworksService, DhcpService]
})
export class NetworksModule {}
