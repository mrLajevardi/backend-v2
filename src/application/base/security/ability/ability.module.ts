import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/entities/Acl';
import { CrudModule } from '../../crud/crud.module';

@Module({
  imports: [TypeOrmModule.forFeature([Acl]), CrudModule],
  providers: [AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
