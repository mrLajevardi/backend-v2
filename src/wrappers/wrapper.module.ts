import { Module, forwardRef } from '@nestjs/common';
import { ZammadWrapperModule } from './zammad-wrapper/zammad-wrapper.module';
import { WrapperService } from './wrapper.service';
import { WrapperStrategy } from './strategy/wrapper.strategy';

@Module({
  imports: [forwardRef(() => ZammadWrapperModule)],
  providers: [WrapperService, WrapperStrategy],
  exports: [WrapperService, ZammadWrapperModule],
})
export class WrapperModule {}
