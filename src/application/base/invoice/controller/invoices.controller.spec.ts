import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { InvoicesService } from '../service/invoices.service';
import { CostCalculationService } from '../service/cost-calculation.service';
import { InvoicesChecksService } from '../service/invoices-checks.service';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { CrudModule } from '../../crud/crud.module';
import { InvoiceValidationService } from '../validators/invoice-validation.service';
import { DatacenterModule } from '../../datacenter/datacenter.module';
import { InvoiceFactoryService } from '../service/invoice-factory.service';
import { InvoiceFactoryVdcService } from '../service/invoice-factory-vdc.service';
import { BASE_INVOICE_SERVICE } from '../interface/service/invoice.interface';

describe('InvoicesController', () => {
  let controller: InvoicesController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        DatacenterModule,
        CrudModule,
        forwardRef(() => VgpuModule),
      ],
      providers: [
        InvoicesService,
        InvoicesChecksService,
        InvoiceValidationService,
        CostCalculationService,
        InvoiceFactoryService,
        InvoiceFactoryVdcService,
        {
          provide: BASE_INVOICE_SERVICE,
          useClass: InvoicesService,
        },
        {
          provide: 'InvoiceService',
          useClass: InvoicesService,
        },
      ],
      controllers: [InvoicesController],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
