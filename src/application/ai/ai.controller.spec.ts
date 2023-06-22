import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { AiService } from './ai.service';
import { UserService } from '../base/user/user/user.service';
import { ServicePropertiesService } from '../base/service/service-properties/service-properties.service';
import { ServiceInstancesService } from '../base/service/service-instances/service/service-instances.service';
import { AiTransactionsLogsService } from '../base/log/ai-transactions-logs/ai-transactions-logs.service';
import { SettingService } from '../base/security/setting/setting.service';
import { ServiceTypesService } from '../base/service/service-types/service-types.service';
import { ConfigsService } from '../base/service/configs/configs.service';
import { DiscountsService } from '../base/service/discounts/discounts.service';
import { TransactionsService } from '../base/transactions/transactions.service';
import { ItemTypesService } from '../base/service/item-types/item-types.service';
import { CreateServiceService } from '../base/service/service-instances/service/create-service/create-service.service';
import { ServiceChecksService } from '../base/service/service-instances/service/service-checks/service-checks.service';
import { PlansService } from '../base/plans/plans.service';
import { QualityPlansService } from '../base/service/quality-plans/quality-plans.service';
import { InvoicesService } from '../base/invoice/invoices/service/invoices.service';
import { ServiceItemsSumService } from '../base/service/service-items-sum/service-items-sum.service';
import { ServiceItemsService } from '../base/service/service-items/service-items.service';
import { InvoiceItemsService } from '../base/invoice/invoice-items/invoice-items.service';
import { InvoiceDiscountsService } from '../base/invoice/invoice-discounts/invoice-discounts.service';
import { InvoicesChecksService } from '../base/invoice/invoices/service/invoices-checks.service';
import { CostCalculationService } from '../base/invoice/invoices/service/cost-calculation.service';
import { InvoicePlansService } from '../base/invoice/invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from '../base/invoice/invoice-properties/invoice-properties.service';
import { VgpuService } from '../vgpu/vgpu.service';
import { SessionsService } from '../base/sessions/sessions.service';

describe('AiController', () => {
  let controller: AiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        AiService,
        UserService,
        ServicePropertiesService,
        ServiceInstancesService,
        ServiceTypesService,
        AiTransactionsLogsService,
        SettingService,
        ConfigsService,
        DiscountsService,
        TransactionsService,
        ItemTypesService,
        CreateServiceService,
        ServiceChecksService,
        PlansService,
        QualityPlansService,
        ServiceItemsService,
        ServiceItemsSumService,
        InvoicesService,
        InvoiceItemsService,
        InvoiceDiscountsService,
        InvoicesChecksService,
        CostCalculationService,
        InvoicePlansService,
        InvoicePropertiesService,
        VgpuService,
        SessionsService,
      ],
      controllers: [AiController],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
