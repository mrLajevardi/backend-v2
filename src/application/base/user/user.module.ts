import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/entities/User';
import { UserController } from './user.controller';
import { AbilityFactory } from 'nest-casl/dist/factories/ability.factory';
import { AbilityModule } from '../ability/ability.module';
import { CaslModule } from 'nest-casl';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AbilityModule,
  ],
  providers: [
    UserService,
    AbilityFactory,
  ],
  exports: [UserService],
  controllers: [UserController] 
})
export class UserModule {}

