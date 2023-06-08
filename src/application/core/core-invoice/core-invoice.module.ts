import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
})
export class CoreInvoiceModule {}
