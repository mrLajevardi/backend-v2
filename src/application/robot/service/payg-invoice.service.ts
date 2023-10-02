import { Injectable } from '@nestjs/common';
import { InvoicesTableService } from 'src/application/base/crud/invoices-table/invoices-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { ServicePlanTypeEnum } from 'src/application/base/service/enum/service-plan-type.enum';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { Not } from 'typeorm';

@Injectable()
export class PaygInvoiceService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly transactionsTable: TransactionsTableService,
    private readonly invoicesTable: InvoicesTableService,
  ) {}

  async paygInvoiceRobot() {
    const targetTransactions: any[] =
      await this.transactionsTable.robotPaygTargetTransactions();
    for (const targetTransaction of targetTransactions) {
      if (targetTransaction.ServiceInstanceID) {
        const service: ServiceInstances =
          await this.serviceInstancesTable.findById(
            targetTransaction.ServiceInstanceID,
          );
        const invoice: Invoices = await this.invoicesTable.create({
          serviceInstanceId: targetTransaction.ServiceInstanceID,
          rawAmount: -targetTransaction.Sum,
          finalAmount: -targetTransaction.Sum,
          description: 'payg invoice',
          dateTime: targetTransaction.StartDate,
          payed: true,
          voided: false,
          //qualityPlan: null,
          type: 2,
          servicePlanType: ServicePlanTypeEnum.Payg,
          endDateTime: targetTransaction.EndDate,
          serviceTypeId: service.serviceTypeId,
          name: null,
          userId: service.userId,
        });
        await this.transactionsTable.deleteAll({
          paymentType: 2,
          serviceInstanceId: targetTransaction.ServiceInstanceID,
          id: Not(targetTransaction.LastID),
        });
        await this.transactionsTable.updateAll(
          {
            id: targetTransaction.LastID,
          },
          {
            value: targetTransaction.Sum,
            invoiceId: invoice.id,
          },
        );
      }
    }
  }
}
