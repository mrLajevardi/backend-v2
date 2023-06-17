import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesChecksService } from './invoices-checks.service';
import { PlansService } from '../../../plans/plans.service';
import { ServiceChecksService } from 'src/application/base/service/service-instances/services/service-checks/service-checks.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceTypesService } from '../../../service/service-types/service-types.service';
import { DiscountsService } from '../../../service/discounts/discounts.service';
import { ServiceInstancesService } from '../../../service/service-instances/service-instances.service';
import { TransactionsService } from '../../../transactions/transactions.service';
import { UserService } from '../../../user/user/user.service';

describe('InvoicesChecksService', () => {
  let service: InvoicesChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        InvoicesChecksService,
        PlansService,
        ServiceChecksService,
        ServiceTypesService,
        DiscountsService,
        ServiceInstancesService,
        TransactionsService,
        UserService,
      ],
    }).compile();

    service = module.get<InvoicesChecksService>(InvoicesChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
