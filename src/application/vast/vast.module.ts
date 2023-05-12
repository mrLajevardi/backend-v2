import { Module } from '@nestjs/common';
import { VastController } from './vast.controller';

@Module({
  controllers: [VastController],
})
export class VastModule {}
