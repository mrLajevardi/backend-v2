import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseModule } from './application/base/base.module';
import { User } from './infrastructure/entities/User';
import { Tickets } from './infrastructure/entities/Tickets';
import { Invoices } from './infrastructure/entities/Invoices';
import { InvoiceItems } from './infrastructure/entities/InvoiceItems';
import { AiTransactionsLogs } from './infrastructure/entities/AiTransactionsLogs';
import { ServiceItems } from './infrastructure/entities/ServiceItems';
import { ServiceTypes } from './infrastructure/entities/ServiceTypes';
import { ServiceInstances } from './infrastructure/entities/ServiceInstances';
import { ServiceProperties } from './infrastructure/entities/ServiceProperties';
import { Tasks } from './infrastructure/entities/Tasks';
import { Sessions } from './infrastructure/entities/Sessions';
import { Discounts } from './infrastructure/entities/Discounts';
import { InvoiceDiscounts } from './infrastructure/entities/InvoiceDiscounts';
import { Groups } from './infrastructure/entities/Groups';
import { GroupsMapping } from './infrastructure/entities/GroupsMapping';
import { InvoiceProperties } from './infrastructure/entities/InvoiceProperties';
import { Organization } from './infrastructure/entities/Organization';
import { Transactions } from './infrastructure/entities/Transactions';
import { ItemTypes } from './infrastructure/entities/ItemTypes';
import { AccessToken } from './infrastructure/entities/AccessToken';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configs } from './infrastructure/entities/Configs';
import  * as path  from 'path';
import { ormconfig } from './infrastructure/configs/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig.primary), //default
    BaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
