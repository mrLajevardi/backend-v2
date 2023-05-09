import { Module } from '@nestjs/common';
import { VpcModule } from './vpc/vpc.module';
import { AiModule } from './ai/ai.module';
import { GpuModule } from './gpu/gpu.module';
import { VastModule } from './vast/vast.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [VpcModule, AiModule, GpuModule, VastModule, GlobalModule]
})
export class ApplicationModule {}
