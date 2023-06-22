import { Module } from '@nestjs/common';
import { VgpuService } from './vgpu.service';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { CrudModule } from '../base/crud/crud.module';

@Module({
  imports: [DatabaseModule, VgpuModule, SessionsModule,CrudModule],
  providers: [VgpuService],
  controllers: [VgpuController],
  exports: [VgpuService],
})
export class VgpuModule {}
