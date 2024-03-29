import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserModule } from '../base/user/user.module';
import { CrudModule } from '../base/crud/crud.module';
import { InvoicesModule } from '../base/invoice/invoices.module';
import { ServiceModule } from '../base/service/service.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { PayAsYouGoModule } from '../base/pay-as-you-go/pay-as-you-go.module';
import { InvoiceItemListModule } from '../base/crud/invoice-item-list/invoice-item-list.module';
import { BaseExceptionModule } from '../../infrastructure/exceptions/base/base-exception.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CrudModule,
    InvoicesModule,
    ServiceModule,
    LoggerModule,
    JwtModule,
    PayAsYouGoModule,
    InvoiceItemListModule,
    BaseExceptionModule,
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
