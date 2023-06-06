import { Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { MigrationsController } from './migrations.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [MigrationsService],
  controllers: [MigrationsController]
})
export class MigrationsModule {}
