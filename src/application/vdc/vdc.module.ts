import { Module } from '@nestjs/common';
import { VdcService } from './vdc.service';
import { OrgService } from './org.service';
import { EdgeService } from './edge.service';

@Module({
  providers: [VdcService, OrgService, EdgeService]
})
export class VdcModule {}
