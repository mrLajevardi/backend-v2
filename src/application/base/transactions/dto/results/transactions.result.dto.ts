import { Transactions } from '../../../../../infrastructure/database/entities/Transactions';
import { isNil } from 'lodash';
import { User } from '../../../../../infrastructure/database/entities/User';
import { PaymentTypes } from '../../../crud/transactions-table/enum/payment-types.enum';
import { Invoices } from '../../../../../infrastructure/database/entities/Invoices';
import { ServiceInstances } from '../../../../../infrastructure/database/entities/ServiceInstances';
import { BaseResultDto } from '../../../../../infrastructure/dto/base.result.dto';

export class TransactionResultDtoFormat {
  id: string;
  user?: object;
  name: string | null;
  invoiceType: number | null;
  planType: number | null;

  invoice?: object;
  serviceInstance?: object;
  paymentType?: PaymentTypes;
  dateTime: Date;
  value: number;
  isApproved: boolean;
}

export class ResultDtoCollectionResponse {
  data: TransactionResultDtoFormat[];
  metaData?: {
    pagination: PaginationResultDtoFormat;
  };
}

export class PaginationResultDtoFormat {
  totalRecords?: number;
  currentPage?: number;
  lastPage?: number;
}

export class TransactionsResultDto extends BaseResultDto {
  collection(
    data: any[],
    paginationData?: PaginationResultDtoFormat,
  ): ResultDtoCollectionResponse {
    const formattedData = data.map((item: Transactions) => {
      return this.toArray(item);
    });

    return {
      data: formattedData,
      metaData: {
        pagination: paginationData,
      },
    };
  }

  toArray(item: Transactions): TransactionResultDtoFormat {
    return {
      id: item.id,
      user: !isNil(item.user) ? this.getUser(item.user) : null,
      name: this.getName(item),
      invoiceType: !isNil(item.invoice) ? item.invoice.type : null,
      planType: this.getPlanType(item),
      value: item.value,
      paymentType: item.paymentType,
      dateTime: item.dateTime,
      isApproved: item.isApproved,
      invoice: !isNil(item.invoice) ? this.getInvoice(item.invoice) : null,
      serviceInstance: !isNil(item.serviceInstance)
        ? this.getServiceInstance(item.serviceInstance)
        : null,
    };
  }

  getPlanType(item: Transactions): number {
    if (!isNil(item.serviceInstance)) {
      return item.serviceInstance.servicePlanType;
    } else if (!isNil(item.invoice)) {
      return item.invoice.servicePlanType;
    } else {
      return null;
    }
  }

  getName(item: Transactions): string {
    switch (item.paymentType) {
      case PaymentTypes.PayToUserCreditByAdmin:
        return 'تراکنش اصلاحی توسط ادمین';
      case PaymentTypes.PayToUserCreditByBudgeting:
        return 'انتقال از بودجه بندی به کیف پول';
      case PaymentTypes.PayByZarinpal:
        return 'افزایش اعتبار از درگاه بانک';
      default:
        if (!isNil(item.serviceInstance)) {
          return item.serviceInstance.name;
        } else if (!isNil(item.invoice)) {
          return item.invoice.name;
        }
    }

    return null;
  }

  getUser(user: User) {
    return {
      name: user.name,
      family: user.family,
    };
  }

  getInvoice(invoice: Invoices) {
    return {
      id: invoice.id,
      payed: invoice.payed,
      name: invoice.name,
      finalAmount: invoice.finalAmount,
      invoiceType: invoice.type,
    };
  }

  getServiceInstance(serviceInstance: ServiceInstances) {
    return {
      id: serviceInstance.id,
      name: serviceInstance.name,
      serviceType: serviceInstance.serviceTypeId,
      servicePlanType: serviceInstance.servicePlanType,
    };
  }
}
