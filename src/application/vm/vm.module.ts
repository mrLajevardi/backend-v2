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
import { VmDetailService } from './service/vm-detail.service';
import { VmDetailFactoryService } from './service/vm-detail.factory.service';
import { VmDetailController } from './controller/vm-detail.controller';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ServicePropertiesModule,
    SessionsModule,
    CrudModule,
    MainWrapperModule,
    forwardRef(() => NetworksModule),
  ],
  controllers: [VmController, VmDetailController],
  providers: [VmService, VmDetailService, VmDetailFactoryService],
  exports: [VmService, VmDetailFactoryService],
})
export class VmModule {}
