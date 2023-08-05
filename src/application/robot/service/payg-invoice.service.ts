import { Injectable } from '@nestjs/common';
import { InvoicesTableService } from 'src/application/base/crud/invoices-table/invoices-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { Not } from 'typeorm';

@Injectable()
export class PaygInvoiceService {

    constructor(
        private readonly serviceInstancesTable: ServiceInstancesTableService,
        private readonly notificationService: NotificationService,
        private readonly userTable: UserTableService,
        private readonly taskManagerService: TaskManagerService,
        private readonly servicePropertiesServicee: ServicePropertiesService,
        private readonly sessionService: SessionsService,
        private readonly transactionsTable: TransactionsTableService,
        private readonly logger: LoggerService,
        private readonly invoicesTable: InvoicesTableService,
      ) {}

      
    async paygInvoiceRobot() {
        const sql = `SELECT SUM
          ( VALUE ) AS Sum,
          MAX ( ID ) AS LastID,
          MAX ( DateTime ) AS EndDate,
          MIN ( DateTime ) AS StartDate,
          [user].Transactions.ServiceInstanceID AS ServiceInstanceID 
          FROM
          [user].Transactions 
          WHERE
          PaymentType = 2 AND InvoiceID IS NULL
          GROUP BY
        [user].Transactions.ServiceInstanceID`;
        const targetTransactions = await new Promise((resolve, reject) => {
          app.models.Transactions
              .dataSource.connector.execute(sql, [], (err, data) => {
                if (err) {
                  return reject(err);
                }
                return resolve(data);
              });
        });
        console.log(targetTransactions);
        for (const targetTransaction of targetTransactions) {
          if (targetTransaction.ServiceInstanceID) {
            const service = await this.serviceInstancesTable.findById(targetTransaction.ServiceInstanceID);
            const invoice = await this.invoicesTable.create({
              serviceInstanceId: targetTransaction.ServiceInstanceID,
              rawAmount: - targetTransaction.Sum,
              finalAmount: - targetTransaction.Sum,
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
                id: Not( targetTransaction.LastID)
           });
            await this.transactionsTable.updateAll({
              id: targetTransaction.LastID,
            }, {
              value: targetTransaction.Sum,
              invoiceId: invoice.id,
            });
          }
        }
      }
      
      paygInvoiceRobot().then((d) => {
        console.log(d);
      }).catch((err) => {
        logger.error({
          message: err.message,
          stackTrace: err.stack,
          userId: null,
        });
      });
      
}
