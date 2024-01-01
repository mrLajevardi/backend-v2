import { Module } from '@nestjs/common';
import { VcloudWrapperModule } from './vcloud-wrapper/vcloud-wrapper.module';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';
import { UvdeskWrapperModule } from './uvdesk-wrapper/uvdesk-wrapper.module';

@Module({
  imports: [VcloudWrapperModule, MainWrapperModule, UvdeskWrapperModule],
})
export class WrapperModule {}
