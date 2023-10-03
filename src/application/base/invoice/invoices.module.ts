import { Module, forwardRef } from '@nestjs/common';
import { InvoicesService } from './service/invoices.service';
import { InvoicesController } from './controller/invoices.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CostCalculationService } from './service/cost-calculation.service';
import { InvoicesChecksService } from './service/invoices-checks.service';
import { CrudModule } from '../crud/crud.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { DatacenterModule } from '../datacenter/datacenter.module';
import { InvoiceValidationService } from './validators/invoice-validation.service';
import { BASE_INVOICE_SERVICE } from './interface/service/invoice.interface';
import { InvoiceFactoryService } from './service/invoice-factory.service';
import { InvoiceFactoryVdcService } from './service/invoice-factory-vdc.service';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    DatacenterModule,
    // VgpuModule,
    forwardRef(() => VgpuModule),
  ],
  providers: [
    InvoicesService,
    InvoicesChecksService,
    InvoiceFactoryService,
    CostCalculationService,
    InvoiceFactoryVdcService,
    InvoiceValidationService,
    {
      provide: BASE_INVOICE_SERVICE,
      useClass: InvoicesService,
    },
  ],
  controllers: [InvoicesController],
  exports: [InvoicesService, BASE_INVOICE_SERVICE],
})
export class InvoicesModule {}
