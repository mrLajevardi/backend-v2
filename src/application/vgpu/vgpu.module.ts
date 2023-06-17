import { Module } from '@nestjs/common';
import { VgpuService } from './vgpu.service';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ConfigsService } from '../base/service/configs/configs.service';
import { SessionsModule } from '../base/sessions/sessions.module';
import { ConfigsModule } from '../base/service/configs/configs.module';

@Module({
  imports: [
    DatabaseModule,
    VgpuModule,
    SessionsModule,
    ConfigsModule
  ],
  providers: [VgpuService],
  controllers: [VgpuController],
  exports: [VgpuService]
})
export class VgpuModule {}
