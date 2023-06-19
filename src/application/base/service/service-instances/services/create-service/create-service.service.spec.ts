import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from './create-service.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ExtendServiceService } from '../extend-service/extend-service.service';
import { ItemTypesService } from '../../../item-types/item-types.service';
import { ConfigsService } from '../../../configs/configs.service';
import { ServiceItemsService } from '../../../service-items/service-items.service';
import { ServiceInstancesService } from '../../service-instances.service';
import { ServiceTypesService } from '../../../service-types/service-types.service';
import { ServicePropertiesService } from '../../../service-properties/service-properties.service';
import { SessionsService } from '../../../../sessions/sessions.service';
import { OrganizationService } from '../../../../organization/organization.service';
import { UserService } from '../../../../user/user/user.service';
import { DiscountsService } from '../../../discounts/discounts.service';
import { ServiceChecksService } from '../service-checks/service-checks.service';
import { PlansService } from '../../../../plans/plans.service';
import { TransactionsService } from '../../../../transactions/transactions.service';
import { QualityPlansService } from '../../../quality-plans/quality-plans.service';
import { ServiceItemsSumService } from '../../../service-items-sum/service-items-sum.service';
import { InvoicesService } from 'src/application/base/invoice/invoices/service/invoices.service';
import { InvoiceItemsService } from 'src/application/base/invoice/invoice-items/invoice-items.service';
import { InvoiceDiscountsService } from 'src/application/base/invoice/invoice-discounts/invoice-discounts.service';
import { InvoicesChecksService } from 'src/application/base/invoice/invoices/service/invoices-checks.service';
import { CostCalculationService } from 'src/application/base/invoice/invoices/service/cost-calculation.service';
import { InvoicePlansService } from 'src/application/base/invoice/invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from 'src/application/base/invoice/invoice-properties/invoice-properties.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';

describe('CreateServiceService', () => {
  let service: CreateServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        CreateServiceService,
        ExtendServiceService,
        ItemTypesService,
        ConfigsService,
        ServiceItemsService,
        ServiceTypesService,
        DiscountsService,
        ServiceInstancesService,
        ServiceChecksService,
        PlansService,
        ServicePropertiesService,
        SessionsService,
        UserService,
        OrganizationService,
        TransactionsService,
        QualityPlansService,
        ServiceItemsSumService,
        InvoicesService,
        InvoiceItemsService,
        InvoicePlansService,
        InvoiceDiscountsService,
        InvoicePropertiesService,
        InvoicesChecksService,
        CostCalculationService,
        VgpuService
      ],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
