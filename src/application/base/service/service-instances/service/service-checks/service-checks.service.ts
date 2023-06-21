import { Injectable } from '@nestjs/common';
import { ServiceTypesService } from 'src/application/base/service/service-types/service-types.service';
import { DiscountsService } from 'src/application/base/service/discounts/discounts.service';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { isEmpty, isNil } from 'lodash';
import { ServiceInstancesService } from '../service-instances.service';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';

@Injectable()
export class ServiceChecksService {
  constructor(
    private readonly serviceInstancesService: ServiceInstancesService,
  ) {}
  //Moved from serviceChecks
  checkNatParams(data, keys) {
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

  async checkServiceMaxAvailable(
    unlimitedService,
    serviceTypeMaxAvailable,
    serviceId,
    userId,
  ) {
    const isMaxAvailable = await this.checkMaxService(
      unlimitedService,
      serviceTypeMaxAvailable,
      serviceId,
      userId,
    );
    if (!isMaxAvailable) {
      throw new MaxAvailableServiceException();
    }
  }

  // Moved from service checks
  async checkMaxService(unlimitedMax, serviceMaxAvailable, serviceId, userId) {
    // checks max service
    const userServiceCount = await this.serviceInstancesService.count({
      where: {
        and: [{ UserID: userId }, { ServiceTypeID: serviceId }],
      },
    });
    if (
      serviceMaxAvailable <= userServiceCount &&
      serviceMaxAvailable !== unlimitedMax
    ) {
      return false;
    }
    return true;
  }

  // Moved from service checks
  checkNetworkType(networkType) {
    const networkTypes = ['NAT_ROUTED', 'ISOLATED'];
    if (networkTypes.includes(networkType)) {
      return true;
    }
    return false;
  }

  // Moved from service checks
  async checkServiceItems(data, items, serviceItemsSum) {
    const itemsList = [];
    const errorDetail = {
      codes: {},
    };
    for (const item of Object.keys(items)) {
      itemsList.push(items[item].Title);
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
      const itemSum = serviceItemsSum.find((itemSum) => itemSum.id == item);
      const sum = !isNil(itemSum) ? itemSum.Sum + data[item] : data[item];
      if (
        sum > items[itemsList.indexOf(item)].MaxAvailable &&
        items[itemsList.indexOf(item)].MaxAvailable !== 0
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
      if (
        parseInt(data[item]) >
        parseInt(items[itemsList.indexOf(item)].MaxPerRequest)
      ) {
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

  // Moved from service checks
  checkServiceParams(data, keys) {
    let status = 0;
    const errorDetail = {
      codes: {},
    };
    for (const key of keys) {
      if (isEmpty(data[key])) {
        errorDetail.codes[key] = [new InvalidServiceParamsException()];
        status = 1;
      }
    }
    if (status) {
      return errorDetail;
    }
    return null;
  }
}
