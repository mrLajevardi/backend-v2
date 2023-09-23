import { Module, forwardRef } from '@nestjs/common';
import { InvoicesService } from './service/invoices.service';
import { InvoicesController } from './controller/invoices.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CostCalculationService } from './service/cost-calculation.service';
import { InvoicesChecksService } from './service/invoices-checks.service';
import { CrudModule } from '../crud/crud.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { DatacenterModule } from '../datacenter/datacenter.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    DatacenterModule,
    // VgpuModule
    forwardRef(() => VgpuModule),
  ],
  providers: [
    InvoicesService,
    InvoicesChecksService,
    CostCalculationService,
    {
      provide: 'InvoiceService',
      useClass: InvoicesService,
    },
  ],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}
