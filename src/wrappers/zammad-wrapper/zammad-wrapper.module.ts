import { Module, forwardRef } from '@nestjs/common';
import { ZAMMAD_WRAPPER_SERVICE } from './const/zammad-wrapper.const';
import { ZammadWrapperBuilderService } from './zammad-wrapper-builder.service';
import { ZammadTicketWrapperService } from './services/wrapper/ticket/zammad-ticket-wrapper.service';
import { WrapperModule } from '../wrapper.module';
import { ZammadUserWrapperService } from './services/wrapper/user/zammad-users-wrapper.service';
import { ZammadArticleWrapperService } from './services/wrapper/ticket/zammad-article-wrapper.service';
import { ZammadStatesWrapperService } from './services/wrapper/ticket/zammad-states-wrapper.service';

@Module({
  imports: [forwardRef(() => WrapperModule)],
  providers: [
    {
      provide: ZAMMAD_WRAPPER_SERVICE,
      useClass: ZammadWrapperBuilderService,
    },
    ZammadTicketWrapperService,
    ZammadUserWrapperService,
    ZammadArticleWrapperService,
    ZammadStatesWrapperService,
  ],
  exports: [
    ZAMMAD_WRAPPER_SERVICE,
    ZammadTicketWrapperService,
    ZammadUserWrapperService,
  ],
})
export class ZammadWrapperModule {}
