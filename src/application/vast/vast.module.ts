import { Module } from '@nestjs/common';
import { VastController } from './vast.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../base/auth/guards/jwt-auth.guard';

@Module({
  controllers: [VastController],
})
export class VastModule {}
