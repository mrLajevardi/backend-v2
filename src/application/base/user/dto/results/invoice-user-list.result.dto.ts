import { ServicePlanTypeEnum } from 'src/application/base/service/enum/service-plan-type.enum';
import { Invoices } from '../../../../../infrastructure/database/entities/Invoices';
import { ServiceInstances } from '../../../../../infrastructure/database/entities/ServiceInstances';
import { BaseResultDto } from '../../../../../infrastructure/dto/base.result.dto';
import { isNil } from 'lodash';
import { ServiceTypesEnum } from 'src/application/base/service/enum/service-types.enum';
import { ApiResponseProperty } from '@nestjs/swagger';

export class InvoiceUserListResultServiceInstanceDtoFormat {
  @ApiResponseProperty({
    type: String,
    example: 'sdfsdf-sdfsdfsdf-sdfsdfsd-sdfsdf',
  })
  id: string;

  @ApiResponseProperty({
    type: String,
    example: 'testing name',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'vdc or ai',
  })
  serviceType: string;
}

export class InvoiceUserListResultDtoFormat {
  @ApiResponseProperty({
    type: Number,
    example: 123,
  })
  id: number;

  @ApiResponseProperty({
    type: ServicePlanTypeEnum,
    enum: ServicePlanTypeEnum,
    example: ServicePlanTypeEnum.Static,
  })
  servicePlanType: ServicePlanTypeEnum;

  @ApiResponseProperty({
    type: String,
    example: 'vdc or ai',
  })
  serviceTypeId: string;

  @ApiResponseProperty({
    type: String,
    example: 'testing name',
  })
  name: string;

  @ApiResponseProperty({
    type: Number,
    example: 100,
  })
  finalAmount: number;

  @ApiResponseProperty({
    type: Number,
    example: 109,
  })
  finalAmountWithTax: number;

  @ApiResponseProperty({
    type: Number,
    example: 0,
  })
  invoiceType: number;

  @ApiResponseProperty({
    type: Number,
    example: 1234,
  })
  code: number | null;

  @ApiResponseProperty({
    type: String,
    example: 'testing description',
  })
  description: string;

  @ApiResponseProperty({
    type: Date,
    example: new Date(),
  })
  dateTime: Date;

  @ApiResponseProperty({
    type: InvoiceUserListResultServiceInstanceDtoFormat,
  })
  serviceInstance: InvoiceUserListResultServiceInstanceDtoFormat;

  @ApiResponseProperty({
    type: Boolean,
    example: true,
  })
  payed: boolean;
}

export class ResultDtoCollectionResponse {
  data: InvoiceUserListResultDtoFormat[];
  metaData?: {
    pagination: PaginationResultDtoFormat;
  };
}

export class PaginationResultDtoFormat {
  @ApiResponseProperty({
    type: Number,
    example: 100,
  })
  totalRecords?: number;
}

export class metaDataResultDtoFormatType {
  @ApiResponseProperty({
    type: PaginationResultDtoFormat,
  })
  pagination: PaginationResultDtoFormat;
}
export class InvoiceUserListResultDtoFormatType {
  @ApiResponseProperty({
    type: Array(InvoiceUserListResultDtoFormat),
  })
  data: InvoiceUserListResultDtoFormat[];

  @ApiResponseProperty({
    type: metaDataResultDtoFormatType,
  })
  metaData: metaDataResultDtoFormatType;
}

export class InvoiceUserList extends BaseResultDto {
  collection(
    data: any[],
    paginationData?: PaginationResultDtoFormat,
  ): InvoiceUserListResultDtoFormatType {
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
      finalAmountWithTax: item.finalAmountWithTax,
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

  getServiceInstance(
    serviceInstance: ServiceInstances,
  ): InvoiceUserListResultServiceInstanceDtoFormat {
    return {
      id: serviceInstance.id,
      name: serviceInstance.name,
      serviceType: serviceInstance.serviceTypeId,
    };
  }
}
