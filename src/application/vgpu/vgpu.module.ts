import { Module } from '@nestjs/common';
import { VgpuService } from './vgpu.service';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ConfigsService } from '../base/configs/configs.service';

@Module({
  imports: [DatabaseModule],
  providers: [VgpuService, ConfigsService],
  controllers: [VgpuController],
})
export class VgpuModule {}
