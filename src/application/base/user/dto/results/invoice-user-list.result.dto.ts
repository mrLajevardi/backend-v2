import { ServicePlanTypeEnum } from 'src/application/base/service/enum/service-plan-type.enum';
import { Invoices } from '../../../../../infrastructure/database/entities/Invoices';
import { ServiceInstances } from '../../../../../infrastructure/database/entities/ServiceInstances';
import { BaseResultDto } from '../../../../../infrastructure/dto/base.result.dto';
import { isNil } from 'lodash';
import { ServiceTypesEnum } from 'src/application/base/service/enum/service-types.enum';

export class InvoiceUserListResultDtoFormat {
  id: number;
  servicePlanType: ServicePlanTypeEnum;
  serviceTypeId: string;
  name: string;
  finalAmount: number;
  invoiceType: number;
  code: number | null;
  description: string;
  dateTime: Date;
  serviceInstance: object;
  payed: boolean;
}

export class ResultDtoCollectionResponse {
  data: InvoiceUserListResultDtoFormat[];
  metaData?: {
    pagination: PaginationResultDtoFormat;
  };
}

export class PaginationResultDtoFormat {
  totalRecords?: number;
}
export class InvoiceUserList extends BaseResultDto {
  collection(
    data: any[],
    paginationData?: PaginationResultDtoFormat,
  ): ResultDtoCollectionResponse {
    const formattedData = data.map((item: Invoices) => {
      return this.toArray(item);
    });

    return {
      data: formattedData,
      metaData: {
        pagination: paginationData,
      },
    };
  }
  toArray(item: Invoices): InvoiceUserListResultDtoFormat {
    return {
      id: item.id,
      servicePlanType: item.servicePlanType,
      serviceTypeId: item.serviceTypeId,
      name: item.name,
      finalAmount: item.finalAmount,
      code: item.code,
      description: item.description,
      dateTime: item.dateTime,
      invoiceType: item.type,
      serviceInstance: !isNil(item.serviceInstance)
        ? this.getServiceInstance(item.serviceInstance)
        : null,
      payed: item.payed,
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
