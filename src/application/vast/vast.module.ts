import { Module } from '@nestjs/common';
import { VastController } from './vast.controller';
import { AbilityFactory } from 'nest-casl/dist/factories/ability.factory';
import { AbilityModule } from '../base/ability/ability.module';

@Module({
  imports: [AbilityModule],
  controllers: [VastController],
})
export class VastModule {}
