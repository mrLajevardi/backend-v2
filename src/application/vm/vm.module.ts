import { Module } from '@nestjs/common';
import { VmService } from './service/vm.service';
import { VmController } from './controller/vm.controller';
import { ServiceModule } from '../base/service/service.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ServicePropertiesModule,
    SessionsModule,
    CrudModule,
  ],
  controllers: [VmController],
  providers: [VmService],
  exports: [],
})
export class VmModule {}
