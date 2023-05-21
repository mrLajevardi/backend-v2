import { Module } from '@nestjs/common';
import { AclService } from './acl.service';
import { AclController } from './acl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/db/entities/Acl';

@Module({
  imports: [
    TypeOrmModule.forFeature([Acl]),
  ],
  providers: [
    AclService,
  ],
  controllers: [AclController],
})
export class AclModule {}
