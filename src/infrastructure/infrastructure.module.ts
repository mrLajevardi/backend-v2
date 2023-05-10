import { Module } from '@nestjs/common';
import { FiltersModule } from './filters/filters.module';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { PipesModule } from './pipes/pipes.module';
import { SecurityModule } from './security/security.module';
import { ConfigsModule } from './configs/configs.module';
import { ExceptionHandlerModule } from './exception-handler/exception-handler.module';
import { EntitiesModule } from './entities/entities.module';
import { LoggingModule } from './logging/logging.module';
import { BaseClassesModule } from './base-classes/base-classes.module';
import { UtilsModule } from './helpers/utils/utils.module';

@Module({
  imports: [
    FiltersModule,
    InterceptorsModule,
    MiddlewaresModule,
    PipesModule,
    SecurityModule,
    ConfigsModule,
    ExceptionHandlerModule,
    EntitiesModule,
    LoggingModule,
    BaseClassesModule,
    UtilsModule
  ],
})
export class InfrastructureModule {}
