import { Module } from '@nestjs/common';
import { VpcModule } from './vpc/vpc.module';
import { AiModule } from './ai/ai.module';
import { GpuModule } from './gpu/gpu.module';
import { VastModule } from './vast/vast.module';
import { CoreModule } from './core/core.module';


@Module({
  imports: [VpcModule, AiModule, GpuModule, VastModule, CoreModule]
})
export class ApplicationModule {}
