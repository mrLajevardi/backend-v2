import { instanceToPlain } from 'class-transformer';
import { ServiceItems } from 'src/infrastructure/database/entities/ServiceItems';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';

export class JoinServiceItemsAndServiceItemsTypeTreeModelDto {
  ServiceItemsID: ServiceItems['id'];
  ItemTypeID: ServiceItemTypesTree['id'];
  ServiceInstanceID: ServiceItems['serviceInstanceId'];
  CodeHierarchy: ServiceItemTypesTree['codeHierarchy'];
  Value: ServiceItems['value'];
}
export class JoinServiceItemsAndServiceItemsTypeTreeReturnType {
  serviceItemsId: ServiceItems['id'];
  itemTypeId: ServiceItemTypesTree['id'];
  serviceInstanceId: ServiceItems['serviceInstanceId'];
  codeHierarchy: ServiceItemTypesTree['codeHierarchy'];
  value: string;

  constructor(dto: JoinServiceItemsAndServiceItemsTypeTreeModelDto) {
    this.codeHierarchy = dto.CodeHierarchy;
    this.itemTypeId = dto.ItemTypeID;
    this.serviceInstanceId = dto.ServiceInstanceID;
    this.serviceItemsId = dto.ServiceItemsID;
    this.value = dto.Value;
  }

  build(): JoinServiceItemsAndServiceItemsTypeTreeReturnType {
    return instanceToPlain<this>(
      this,
    ) as JoinServiceItemsAndServiceItemsTypeTreeReturnType;
  }
}
