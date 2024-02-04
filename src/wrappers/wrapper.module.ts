import { Module, forwardRef } from '@nestjs/common';
import { VcloudWrapperModule } from './vcloud-wrapper/vcloud-wrapper.module';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';
import { UvdeskWrapperModule } from './uvdesk-wrapper/uvdesk-wrapper.module';
import { ZammadWrapperModule } from './zammad-wrapper/zammad-wrapper.module';
import { WrapperService } from './wrapper.service';
import { WrapperStrategy } from './strategy/wrapper.strategy';

@Module({
  imports: [
    // VcloudWrapperModule,
    // MainWrapperModule,
    // UvdeskWrapperModule,
    forwardRef(() => ZammadWrapperModule),
  ],
  providers: [WrapperService, WrapperStrategy],
  exports: [WrapperService, ZammadWrapperModule],
})
export class WrapperModule {}
