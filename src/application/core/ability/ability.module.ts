import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { AclService } from 'src/application/base/acl/acl.service';
import { AclModule } from 'src/application/base/acl/acl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/entities/Acl';

@Module({
  imports: [AclModule, TypeOrmModule.forFeature([Acl])],
  providers: [AbilityFactory, AclService],
  exports: [AbilityFactory],
})
export class AbilityModule {}
