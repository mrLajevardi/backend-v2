
import { Module } from '@nestjs/common';
import { AccessTokenTableService } from './access-token-table.service';
//import { AccessTokenTableController } from './access-token-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AccessTokenTableService],
  //controllers: [AccessTokenTableController],
  exports: [AccessTokenTableService],
})
export class AccessTokenTableModule {}

			