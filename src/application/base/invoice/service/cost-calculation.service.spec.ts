import { Test, TestingModule } from '@nestjs/testing';
import { CostCalculationService } from './cost-calculation.service';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { InvoiceFactoryService } from './invoice-factory.service';

describe('CostCalculationService', () => {
  let service: CostCalculationService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule, forwardRef(() => VgpuModule)],

      providers: [CostCalculationService, InvoiceFactoryService],
    }).compile();

    service = module.get<CostCalculationService>(CostCalculationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
