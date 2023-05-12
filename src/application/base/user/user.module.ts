import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/entities/User';
import { UserController } from './user.controller';
import { GroupsMapping } from 'src/infrastructure/entities/GroupsMapping';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController] 
})
export class UserModule {}
