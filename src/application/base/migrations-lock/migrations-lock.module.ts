import { Module } from '@nestjs/common';
import { MigrationsLockService } from './migrations-lock.service';
import { MigrationsLockController } from './migrations-lock.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [MigrationsLockService],
  controllers: [MigrationsLockController]
})
export class MigrationsLockModule {}
