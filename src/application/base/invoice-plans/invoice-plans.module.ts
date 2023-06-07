import { Module } from '@nestjs/common';
import { InvoicePlansService } from './invoice-plans.service';
import { InvoicePlansController } from './invoice-plans.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoicePlansService],
  controllers: [InvoicePlansController],
})
export class InvoicePlansModule {}
