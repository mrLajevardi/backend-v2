import { Module } from '@nestjs/common';
import { VastController } from './vast.controller';
import { AbilityFactory } from 'nest-casl/dist/factories/ability.factory';
import { AbilityModule } from '../base/ability/ability.module';
import { UserModule } from '../base/user/user.module';

@Module({
  imports: [AbilityModule, UserModule],
  controllers: [VastController],
})
export class VastModule {}
