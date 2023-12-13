import { Injectable } from '@nestjs/common';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { isEmpty, isNil } from 'lodash';
import { ErrorDetail } from '../dto/return/error-detail.dto';
import { ServiceItemsSum } from 'src/infrastructure/database/entities/views/service-items-sum';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { ServicePaymentsTableService } from '../../crud/service-payments-table/service-payments-table.service';

@Injectable()
export class ServiceChecksService {
  constructor(
    private readonly serviceItemsSumTable: ServiceItemsSumService,
    private readonly servicePaymentsTableService: ServicePaymentsTableService,
  ) {}

  //Moved from serviceChecks
  checkNatParams(data: object, keys: string[]): boolean | ErrorDetail {
    let status = 0;
    const errorDetail = {
      codes: {},
    };
    for (const key of keys) {
      if (isEmpty(data[key]) || data[key] == '') {
        errorDetail.codes[key] = [new InvalidServiceParamsException('absense')];
        status = 1;
      }
    }
    if (status) {
      return errorDetail;
    }
    return false;
  }

  // Moved from service checks
  checkNetworkType(networkType: string): boolean {
    const networkTypes = ['NAT_ROUTED', 'ISOLATED'];
    if (networkTypes.includes(networkType)) {
      return true;
    }
    return false;
  }

  // Moved from service checks
  async checkServiceItems(
    data: [number],
    items: ItemTypes[],
  ): Promise<ErrorDetail | null> {
    const itemsList = [];
    const errorDetail = {
      codes: {},
    };
    for (const item of Object.keys(items)) {
      itemsList.push(items[item].title);
    }
    let status = 0;
    for (const item of itemsList) {
      if (!data[item] || typeof data[item] !== 'number') {
        // MUST BE REVIEWd
        errorDetail.codes[item] = [
          new InvalidServiceParamsException('absense'),
        ];
        status = 1;
      }
    }
    for (const item of itemsList) {
      const itemSum: ServiceItemsSum = await this.serviceItemsSumTable.findById(
        item,
      );
      const sum = !isNil(itemSum) ? itemSum.sum + data[item] : data[item];
      if (
        sum > items[itemsList.indexOf(item)].maxAvailable &&
        items[itemsList.indexOf(item)].maxAvailable !== 0
      ) {
        if (!errorDetail.codes[item]) {
          errorDetail.codes[item] = [
            new InvalidServiceParamsException('max_available'),
          ];
        } else {
          errorDetail.codes[item].push(
            new InvalidServiceParamsException('max_per_request'),
          );
        }
        status = 1;
      }
      // checks maxPerRequest
      if (data[item] > items[itemsList.indexOf(item)].maxPerRequest) {
        if (!errorDetail.codes[item]) {
          // if errorDetails.codes[item] does not exist
          errorDetail.codes[item] = [
            new InvalidServiceParamsException('max_per_request'),
          ];
        } else {
          // if errorDetails.codes[item] does exist
          errorDetail.codes[item].push(
            new InvalidServiceParamsException('max_per_request'),
          );
        }
        status = 1;
      }
    }
    if (status) {
      return errorDetail;
    }
    return null;
  }

  async getServiceCreditBy(serviceInstanceId: string) {
    const servicePayment = await this.servicePaymentsTableService
      .getQueryBuilder()
      .select('SUM(ServicePayments.Price)', 'Credit')
      .where(`ServicePayments.ServiceInstanceId= :serviceInstanceId`, {
        serviceInstanceId,
      })
      .getRawOne();
    return servicePayment.Credit;
  }
}
