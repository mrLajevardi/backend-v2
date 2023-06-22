import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from './create-service.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ExtendServiceService } from './extend-service.service';
import { SessionsService } from '../../sessions/sessions.service';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/user.service';
import { DiscountsService } from './discounts.service';
import { ServiceChecksService } from './service-checks/service-checks.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { QualityPlansService } from '../../crud/quality-plans/quality-plans.service';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { InvoicesService } from 'src/application/base/invoice/service/invoices.service';
import { InvoicesChecksService } from 'src/application/base/invoice/service/invoices-checks.service';
import { CostCalculationService } from 'src/application/base/invoice/service/cost-calculation.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';

describe('CreateServiceService', () => {
  let service: CreateServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        CreateServiceService,
        ExtendServiceService,
        DiscountsService,
        ServiceChecksService,
        SessionsService,
        UserService,
        OrganizationService,
        TransactionsService,
        QualityPlansService,
        ServiceItemsSumService,
        InvoicesService,
        InvoicesChecksService,
        CostCalculationService,
        VgpuService,
      ],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
