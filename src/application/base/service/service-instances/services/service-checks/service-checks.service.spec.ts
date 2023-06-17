import { Test, TestingModule } from '@nestjs/testing';
import { ServiceChecksService } from './service-checks.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceTypesService } from '../../../service-types/service-types.service';
import { DiscountsService } from '../../../discounts/discounts.service';
import { ServiceInstancesService } from '../../service-instances.service';
import { TransactionsService } from '../../../../transactions/transactions.service';
import { UserService } from '../../../../user/user/user.service';

describe('ServiceChecksService', () => {
  let service: ServiceChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        ServiceChecksService,
        ServiceTypesService,
        ServiceInstancesService,
        DiscountsService,
        TransactionsService,
        UserService,
      ],
    }).compile();

    service = module.get<ServiceChecksService>(ServiceChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
