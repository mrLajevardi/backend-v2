import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { CostCalculationService } from './cost-calculation.service';
import { InvoicesChecksService } from './invoices-checks.service';
import { PlansService } from '../../../plans/plans.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ConfigsService } from '../../../service/configs/configs.service';
import { DiscountsService } from '../../../service/discounts/discounts.service';
import { InvoiceItemsService } from '../../invoice-items/invoice-items.service';
import { InvoicePlansService } from '../../invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from '../../invoice-properties/invoice-properties.service';
import { ItemTypesService } from '../../../service/item-types/item-types.service';
import { OrganizationService } from '../../../organization/organization.service';
import { ServiceInstancesService } from '../../../service/service-instances/service-instances.service';
import { ServiceTypesService } from '../../../service/service-types/service-types.service';
import { SessionsService } from '../../../sessions/sessions.service';
import { TransactionsService } from '../../../transactions/transactions.service';
import { UserService } from '../../../user/user/user.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        InvoicesService,
        CostCalculationService,
        InvoicesChecksService
      ],
      exports:[
        InvoicesService,
        CostCalculationService,
        InvoicesChecksService
      ]
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
