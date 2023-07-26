import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/entities/Acl';
import { CrudModule } from '../../crud/crud.module';
import { AbilityAdminService } from './service/ability-admin.service';
import { AbilityController } from './controller/ability.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Acl]), CrudModule],
  providers: [AbilityFactory, AbilityAdminService],
  exports: [AbilityFactory],
  controllers: [AbilityController],
})
export class AbilityModule {}
