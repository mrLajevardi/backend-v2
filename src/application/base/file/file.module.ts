import { Module } from '@nestjs/common';
import { FileController } from './controller/file.controller';
import { FileService } from './service/file.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [DatabaseModule, CrudModule],
  controllers: [FileController],

  providers: [FileService],
})
export class FileModule {}
