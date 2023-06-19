import { Module } from '@nestjs/common';
import { SysdiagramsService } from './sysdiagrams.service';
import { SysdiagramsController } from './sysdiagrams.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SysdiagramsService],
  controllers: [SysdiagramsController],
  exports: [SysdiagramsService],
})
export class SysdiagramsModule {}
