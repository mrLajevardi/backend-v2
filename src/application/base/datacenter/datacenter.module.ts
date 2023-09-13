import { Module } from '@nestjs/common';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterController } from './datacenter.controller';
import { IDatacenterService } from './interface/IDatacenter.service';
@Module({
  imports: [],
  providers: [
    {
      provide: 'IDatacenterService',
      useClass: DatacenterService,
    },
  ],
  controllers: [DatacenterController],
})
export class DatacenterModule {}
