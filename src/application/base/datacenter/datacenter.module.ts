import { Module } from '@nestjs/common';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterController } from './datacenter.controller';
@Module({
  imports: [],
  providers: [DatacenterService],
  controllers: [DatacenterController],
})
export class DatacenterModule {}
