import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/database/entities/User';
import { UserController } from './user.controller';
import { AbilityFactory } from 'nest-casl/dist/factories/ability.factory';
import { AbilityModule } from '../ability/ability.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    UserService,
  ],
  exports: [UserService],
  controllers: [UserController] 
})
export class UserModule {}

