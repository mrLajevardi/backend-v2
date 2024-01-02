import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateServiceService } from '../../service/services/create-service.service';
import { PaygServiceService } from '../../service/services/payg-service.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';

@Injectable()
export class UsersFactoryService {
  constructor(
    @Inject(forwardRef(() => CreateServiceService))
    private readonly createServiceService: CreateServiceService,
    private readonly paygServiceService: PaygServiceService,
    private readonly invoiceTableService: InvoicesTableService,
  ) {}
  async runServiceBasedOnInvoice(
    invoiceId: number,
    options: SessionRequest,
  ): Promise<void> {
    const invoice = await this.invoiceTableService.findById(invoiceId);
    if (invoice.serviceTypeId === ServiceTypesEnum.Vdc) {
      if (invoice.servicePlanType === ServicePlanTypeEnum.Static) {
        await this.createServiceService.createService(options, { invoiceId });
      } else if (invoice.servicePlanType === ServicePlanTypeEnum.Payg) {
        await this.paygServiceService.createPaygVdcService(
          {
            invoiceId,
          },
          options,
        );
      }
    }
  }
}
