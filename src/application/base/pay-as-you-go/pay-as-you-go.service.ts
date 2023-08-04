import { ForbiddenException, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { PaymentRequiredException } from 'src/infrastructure/exceptions/payment-required.exception';
import { ServiceInstancesTableService } from '../crud/service-instances-table/service-instances-table.service';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';
import { UserTableService } from '../crud/user-table/user-table.service';
import { Severity } from '@sentry/node';

@Injectable()
export class PayAsYouGoService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly serviceInstanceTable: ServiceInstancesTableService,
  ) {}

  async payAsYouGoService(serviceInstanceId, cost) {
    if (isNil(serviceInstanceId)) {
      return Promise.reject(new ForbiddenException());
    }
    const service = await this.serviceInstanceTable.findOne({
      where: {
        id: serviceInstanceId,
      },
    });

    if (!service) {
      return Promise.reject(new ForbiddenException());
    }

    const { userId: userId } = service;
    const itmeData = {
      userId: userId.toString(),
      dateTime: new Date(),
      value: -cost,
      invoiceId: null,
      description: `PAYG`,
      isApproved: true,
      serviceInstanceId: serviceInstanceId,
      paymentType: 2, // payAsYouGo payment method
      paymentToken: null,
    };
    console.log(itmeData);
    // await this.transactionsTable.create(itmeData);
    console.log(service);

    const { credit } = await this.userTable.findById(userId);
    console.log(credit);
    if (credit < cost) {
      return Promise.reject(new PaymentRequiredException());
    }
    await this.userTable.update(userId, {
      credit: credit - cost,
    });
  }

  async updateLastPAYG(serviceInstanceId, cost) {
    const service = await this.serviceInstanceTable.findOne({
      where: {
        ID: serviceInstanceId,
      },
    });
    const nextPayg = service.nextPayg;
    let nextPAYG = new Date(new Date().getTime());
    if (nextPayg != null) {
      nextPAYG = new Date(new Date(nextPayg).getTime());
    }

    const currentDate = new Date(new Date().getTime() + 1000 * 60);
    const dateAddHour1 = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);

    if (nextPAYG < dateAddHour1) {
      const lastPAYG = new Date(service.lastPayg);
      const dateAddHourLastPAYG = new Date(
        lastPAYG.getTime() + 1 * 60 * 60 * 1000,
      ); // Add 1 hour in milliseconds
      const dateAddHour =
        nextPAYG > currentDate ? dateAddHourLastPAYG : dateAddHour1;
      await this.serviceInstanceTable.updateAll(
        { id: serviceInstanceId },
        {
          lastPayg: new Date(),
          nextPayg: dateAddHour,
        },
      );
      console.log(cost, '💲💲💳');
      this.payAsYouGoService(serviceInstanceId, cost);
    }
  }
}
