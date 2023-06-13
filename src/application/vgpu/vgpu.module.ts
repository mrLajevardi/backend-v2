import { Module } from '@nestjs/common';
import { VgpuService } from './vgpu.service';
import { VgpuController } from './vgpu.controller';

@Module({
  providers: [VgpuService],
  controllers: [VgpuController],
})
export class VgpuModule {}
