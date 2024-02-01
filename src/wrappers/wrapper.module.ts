import { Module } from '@nestjs/common';
import { VcloudWrapperModule } from './vcloud-wrapper/vcloud-wrapper.module';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';
import { UvdeskWrapperModule } from './uvdesk-wrapper/uvdesk-wrapper.module';
import { ZammadWrapperModule } from './zammad-wrapper/zammad-wrapper.module';

@Module({
  imports: [VcloudWrapperModule, MainWrapperModule, UvdeskWrapperModule, ZammadWrapperModule],
})
export class WrapperModule {}
