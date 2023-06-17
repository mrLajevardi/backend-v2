import { Module } from '@nestjs/common';
import { ScopeService } from './scope.service';
import { ScopeController } from './scope.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ScopeService],
  controllers: [ScopeController],
  exports: [ScopeService]
})
export class ScopeModule {}
