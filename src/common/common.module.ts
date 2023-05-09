import { Module } from '@nestjs/common';
import { FiltersModule } from './filters/filters.module';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { PipesModule } from './pipes/pipes.module';

@Module({
  imports: [FiltersModule, InterceptorsModule, MiddlewaresModule, PipesModule]
})
export class CommonModule {}
