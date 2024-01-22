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
import { UserModule } from '../user/user.module';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { PaygCostCalculationService } from './service/payg-cost-calculation.service';
import { PaygInvoiceService } from './service/payg-invoice.service';
import { InvoiceStrategy } from './classes/invoice-strategy';
import { InvoiceAiStrategyService } from './classes/invoice-ai-strategy/invoice-ai-strategy.service';
import { InvoiceVdcStrategyService } from './classes/invoice-vdc-strategy/invoice-vdc-strategy.service';
import { BaseExceptionModule } from '../../../infrastructure/exceptions/base/base-exception.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    BaseExceptionModule,
    forwardRef(() => DatacenterModule),
    forwardRef(() => UserModule),
    forwardRef(() => VdcModule),
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
    PaygCostCalculationService,
    PaygInvoiceService,
    {
      provide: BASE_INVOICE_SERVICE,
      useClass: InvoicesService,
    },
    InvoiceAiStrategyService,
    InvoiceVdcStrategyService,
    InvoiceStrategy,
  ],
  controllers: [InvoicesController],
  exports: [
    InvoicesService,
    BASE_INVOICE_SERVICE,
    InvoiceFactoryVdcService,
    InvoiceFactoryService,
    PaygCostCalculationService,
    PaygInvoiceService,
    InvoiceAiStrategyService,
    InvoiceVdcStrategyService,
    InvoiceStrategy,
  ],
})
export class InvoicesModule {}
