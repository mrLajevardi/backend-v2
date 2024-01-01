import { Module } from '@nestjs/common';
import { VusersTableService } from './vusers-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [VusersTableService],
  exports: [VusersTableService],
})
export class VusersTableModule {}
