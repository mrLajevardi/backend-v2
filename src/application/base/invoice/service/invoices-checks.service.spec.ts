import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesChecksService } from './invoices-checks.service';
import { ServiceChecksService } from 'src/application/base/service/services/service-checks/service-checks.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { DiscountsService } from '../../service/services/discounts.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UserService } from '../../user/user.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';

describe('InvoicesChecksService', () => {
  let service: InvoicesChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [

      ],
    }).compile();

    service = module.get<InvoicesChecksService>(InvoicesChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
