import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesChecksService } from './invoices-checks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { CrudModule } from '../../crud/crud.module';

describe('InvoicesChecksService', () => {
  let service: InvoicesChecksService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        VgpuModule,
        CrudModule,
        forwardRef(() => VgpuModule),
      ],
      providers: [InvoicesChecksService],
    }).compile();

    service = module.get<InvoicesChecksService>(InvoicesChecksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
