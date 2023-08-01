import { Test, TestingModule } from '@nestjs/testing';
import { ServiceChecksService } from './service-checks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DiscountsService } from '../discounts.service';
import { TransactionsService } from '../../../transactions/transactions.service';
import { UserService } from '../../../user/service/user.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServiceTypesTableService } from 'src/application/base/crud/service-types-table/service-types-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { DiscountsTableService } from 'src/application/base/crud/discounts-table/discounts-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';

describe('ServiceChecksService', () => {
  let service: ServiceChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        ServiceChecksService,
        ServiceTypesTableService,
        ServiceInstancesTableService,
        DiscountsService,
        TransactionsService,
        UserService,
        UserTableService,
        DiscountsTableService,
        TransactionsTableService,
      ],
    }).compile();

    service = module.get<ServiceChecksService>(ServiceChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
