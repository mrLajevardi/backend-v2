import { Injectable } from '@nestjs/common';
import { InvoicesTableService } from 'src/application/base/crud/invoices-table/invoices-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { Not } from 'typeorm';

@Injectable()
export class PaygInvoiceService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly transactionsTable: TransactionsTableService,
    private readonly invoicesTable: InvoicesTableService,
  ) {}

  async paygInvoiceRobot() {
    const targetTransactions =
      await this.transactionsTable.robotPaygTargetTransactions();
    console.log(targetTransactions);
    for (const targetTransaction of targetTransactions) {
      if (targetTransaction.ServiceInstanceID) {
        const service = await this.serviceInstancesTable.findById(
          targetTransaction.ServiceInstanceID,
        );
        const invoice = await this.invoicesTable.create({
          serviceInstanceId: targetTransaction.ServiceInstanceID,
          rawAmount: -targetTransaction.Sum,
          finalAmount: -targetTransaction.Sum,
          description: 'payg invoice',
          dateTime: targetTransaction.StartDate,
          payed: true,
          voided: false,
          //qualityPlan: null,
          type: 2,
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
