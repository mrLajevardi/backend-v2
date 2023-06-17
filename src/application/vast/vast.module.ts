import { Module } from '@nestjs/common';
import { VastController } from './vast.controller';
import { AbilityModule } from '../base/security/ability/ability.module';
import { UserModule } from '../base/user/user/user.module';

@Module({
  imports: [AbilityModule, UserModule],
  controllers: [VastController],
})
export class VastModule {}
