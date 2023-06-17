import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ConfigsService],
  controllers: [ConfigsController],
  exports: [ConfigsService]
})
export class ConfigsModule {}
