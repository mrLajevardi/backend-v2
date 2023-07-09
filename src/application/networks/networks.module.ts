import { Module } from '@nestjs/common';
import { NetworksService } from './networks.service';
import { DhcpService } from './dhcp.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { CrudModule } from '../base/crud/crud.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ServiceModule,
    SessionsModule,
    CrudModule
  ],
  providers: [NetworksService, DhcpService],
})
export class NetworksModule {}
