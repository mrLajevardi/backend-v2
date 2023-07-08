import { Module } from '@nestjs/common';
import { NatService } from './nat.service';

@Module({
  providers: [NatService],
})
export class NatModule {}
