import { Injectable } from '@nestjs/common';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { isEmpty, isNil } from 'lodash';

@Injectable()
export class ServiceChecksService {
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
}
