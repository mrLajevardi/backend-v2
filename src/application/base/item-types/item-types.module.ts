import { Module } from '@nestjs/common';
import { ItemTypesService } from './item-types.service';
import { ItemTypesController } from './item-types.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [ItemTypesService],
  controllers: [ItemTypesController]
})
export class ItemTypesModule {}
