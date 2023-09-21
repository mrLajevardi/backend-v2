import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { FindManyOptions, Like } from 'typeorm';
import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';

@Injectable()
export class DatacenterFactoryService {
  public GetFindOptionBy(
    query: DatacenterConfigGenItemsQueryDto,
  ): FindManyOptions<ItemTypesConfig> {
    const option: FindManyOptions<ItemTypesConfig> = {};
    option.where = {};
    if (
      query.DataCenterId != undefined &&
      query.DataCenterId.trim().length > 0
    ) {
      // option.where.datacenterName = query.DataCenterId;
      option.where.datacenterName = Like(`${query.DataCenterId.toLowerCase()}`);
      // option.where.datacenterName = query.DataCenterId;
    }
    option.relations = { serviceType: true };
    if (
      query.ServiceTypeId !== undefined &&
      query.ServiceTypeId.trim().length > 0
    ) {
      // option.where.datacenterName = Like(`%${query.DataCenterId}%`);

      // option.where.serviceType = { id: Like(`%${query.ServiceTypeId}`) };
      option.where.serviceType = {
        id: Like(`${query.ServiceTypeId.toLowerCase()}`),
      };
    }

    return option;
  }
  public CreateItemTypeConfigTree(
    ItemTypesConfig: DatacenterConfigGenItemsResultDto[],
    parentId: number,
    res: DatacenterConfigGenItemsResultDto[] = [],
  ): DatacenterConfigGenItemsResultDto[] {
    const parents = ItemTypesConfig.filter((d) => d.ParentId == parentId);

    if (parents != null && parents.length > 0) {
      parents.forEach((e: DatacenterConfigGenItemsResultDto): void => {
        const res2: DatacenterConfigGenItemsResultDto[] =
          this.CreateItemTypeConfigTree(ItemTypesConfig, e.Id, e.SubItems);
        if (res2 != null && res2.length > 0) {
          e.SubItems.concat(res2);
        }
        res.push(e);
      });
    }
    return res;
  }

  public GetDtoModelConfigItemDto(
    configs: ItemTypesConfig[],
  ): DatacenterConfigGenItemsResultDto[] {
    const res: DatacenterConfigGenItemsResultDto[] = [];
    configs.forEach((itemTypeConfig): void => {
      res.push(
        new DatacenterConfigGenItemsResultDto(
          itemTypeConfig.id,
          itemTypeConfig.title,
          itemTypeConfig.serviceType.id,
          itemTypeConfig.price,
          itemTypeConfig.percent,
          itemTypeConfig.min,
          itemTypeConfig.max,
          itemTypeConfig.unit,
          itemTypeConfig.parentId,
        ),
      );
    });
    return res;
  }

  public GetDatacenterConfigSearched(
    tree: DatacenterConfigGenItemsResultDto[],
    query: DatacenterConfigGenItemsQueryDto,
    regexPattern: RegExp,
  ): DatacenterConfigGenItemsResultDto[] {
    return (tree = tree.filter(
      (datacenterConfig) =>
        (datacenterConfig.ItemTypeName.toLowerCase().includes(
          'g'.toLowerCase(),
        ) &&
          datacenterConfig.ItemTypeName.trim().toLowerCase() ==
            query.GenId.toLowerCase()) ||
        !regexPattern.test(datacenterConfig.ItemTypeName),
    ));
  }
}
