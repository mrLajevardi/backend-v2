import { Module } from '@nestjs/common';
import { VcloudWrapperModule } from './vcloud-wrapper/vcloud-wrapper.module';

@Module({
  imports: [VcloudWrapperModule]
})
export class WrapperModule {}
