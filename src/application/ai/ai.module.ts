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

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CrudModule,
    InvoicesModule,
    ServiceModule,
    LoggerModule,
    JwtModule
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
