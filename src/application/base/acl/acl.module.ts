import { Module } from '@nestjs/common';
import { AclService } from './acl.service';
import { AclController } from './acl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/entities/Acl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    AclService,
  ],
  controllers: [AclController],
})
export class AclModule {}
