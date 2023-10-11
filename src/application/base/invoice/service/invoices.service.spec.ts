import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CostCalculationService } from './cost-calculation.service';
import { InvoicesChecksService } from './invoices-checks.service';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { CrudModule } from '../../crud/crud.module';
import { InvoiceValidationService } from '../validators/invoice-validation.service';
import { DatacenterModule } from '../../datacenter/datacenter.module';
import { InvoiceFactoryService } from './invoice-factory.service';
import { InvoiceFactoryVdcService } from './invoice-factory-vdc.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

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
        CostCalculationService,
        InvoiceValidationService,
        InvoiceFactoryService,
        InvoiceFactoryVdcService,
      ],
      exports: [InvoicesService, CostCalculationService, InvoicesChecksService],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
