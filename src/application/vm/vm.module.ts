import { Module, forwardRef } from '@nestjs/common';
import { VmService } from './service/vm.service';
import { VmController } from './controller/vm.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { NetworksModule } from '../networks/networks.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ServicePropertiesModule,
    SessionsModule,
    CrudModule,
    MainWrapperModule,
    forwardRef(()=>NetworksModule) ,
  ],
  controllers: [VmController],
  providers: [VmService],
  exports: [VmService],
})
export class VmModule {}
