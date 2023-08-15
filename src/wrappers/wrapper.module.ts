import { Module } from '@nestjs/common';
import { VcloudWrapperModule } from './vcloud-wrapper/vcloud-wrapper.module';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';

@Module({
  imports: [VcloudWrapperModule, MainWrapperModule]
})
export class WrapperModule {}
