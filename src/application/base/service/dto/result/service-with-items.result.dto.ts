import { VServiceInstances } from '../../../../../infrastructure/database/entities/views/v-serviceInstances';
import { VServiceInstanceDetail } from '../../../../../infrastructure/database/entities/views/v-serviceInstanceDetail';
import { isNil } from 'lodash';

export class ServiceWithItemsResultDto {
  collection(items: VServiceInstances[]) {
    return items.map((item) => {
      return this.toArray(item);
    });
  }
  toArray(item: VServiceInstances) {
    return {
      id: item.id,
      userId: item.userId,
      serviceTypeId: item.serviceTypeId,
      status: item.status,
      createDate: item.createDate,
      expireDate: item.expireDate,
      isDeleted: item.isDeleted,
      name: item.name,
      credit: item.credit,
      daysLeft: item.daysLeft,
      autoPaid: item.autoPaid,
      datacenterName: item.datacenterName,
      servicePlanType: item.servicePlanType,
      guaranty: this.getGuaranty(item.vServiceItems),
      serviceItems: !isNil(item.vServiceItems)
        ? this.getVItems(item.vServiceItems)
        : [],
    };
  }

  getVItems(items: VServiceInstanceDetail[]) {
    return items.map((item) => {
      return {
        id: item.itemTypeId,
        value: item.value,
        itemTypeCode: item.code,
        itemHierarchyCode: item.codeHierarchy,
        itemTitle: item.title,
        serviceInstanceId: item.serviceInstanceId,
      };
    });
  }

  getGuaranty(items: VServiceInstanceDetail[]) {
    const data = items.find((item) => item.codeHierarchy.includes('guaranty'));

    return {
      id: data.itemTypeId,
      value: data.value,
      itemTypeCode: data.code,
      itemHierarchyCode: data.codeHierarchy,
      itemTitle: data.title,
      serviceInstanceId: data.serviceInstanceId,
    };
  }
}
