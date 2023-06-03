import { Module } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { ServiceTypesController } from './service-types.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceTypesService],
  controllers: [ServiceTypesController]
})
export class ServiceTypesModule {}
