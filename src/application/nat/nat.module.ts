import { Module } from '@nestjs/common';
import { NatService } from './nat.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { CrudModule } from '../base/crud/crud.module';
import { NatController } from './nat.controller';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    SessionsModule,
    CrudModule,
    ServicePropertiesModule,
  ],
  providers: [NatService],
  controllers: [NatController],
})
export class NatModule {}
