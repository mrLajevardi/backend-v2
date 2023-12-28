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
  invoice?: object;
  serviceInstance?: object;
  type?: PaymentTypes;
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
      invoice: !isNil(item.invoice) ? this.getInvoice(item.invoice) : null,
      serviceInstance: !isNil(item.serviceInstance)
        ? this.getServiceInstance(item.serviceInstance)
        : null,
      value: item.value,
      type: item.paymentType,
      dateTime: item.dateTime,
      isApproved: item.isApproved,
    };
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
      //   add base amount to this method
    };
  }
  getServiceInstance(serviceInstance: ServiceInstances) {
    return {
      id: serviceInstance.id,
      name: serviceInstance.name,
      serviceType: serviceInstance.serviceTypeId,
    };
  }
}
