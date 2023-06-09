import { Module } from '@nestjs/common';
import { VastController } from './vast.controller';
import { AbilityModule } from '../core/ability/ability.module';
import { UserModule } from '../base/user/user.module';

@Module({
  imports: [AbilityModule, UserModule],
  controllers: [VastController],
})
export class VastModule {}
