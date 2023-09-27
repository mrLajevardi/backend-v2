import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { FindManyOptions, FindOptionsWhere, IsNull, Like } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';

@Injectable()
export class DatacenterFactoryService {
  public GetFindOptionBy(
    query: DatacenterConfigGenItemsQueryDto,
  ): FindManyOptions<ItemTypes> {
    const option: FindManyOptions<ItemTypes> = {};
    const generationName = 'Generation';
    const findOptionsItemTypes: FindOptionsWhere<ItemTypes>[] = [];
    option.where = [];

    if (
      query.DataCenterId != undefined &&
      query.DataCenterId.trim().length > 0
    ) {
      findOptionsItemTypes.push(
        { datacenterName: Like(`${query.DataCenterId.toLowerCase()}`) },

        {
          datacenterName: IsNull(),
          code: generationName,
          title: generationName,
          // serviceTypeId: Like(`${'vdc'}`),
        },
      );
    }
    option.relations = { serviceType: true };
    if (
      query.ServiceTypeId !== undefined &&
      query.ServiceTypeId.trim().length > 0
    ) {
      findOptionsItemTypes.push({
        serviceTypeId: Like(`${query.ServiceTypeId.toLowerCase()}`),
      });
    }
    for (
      let conditionIndex = 0;
      conditionIndex < findOptionsItemTypes.length;
      conditionIndex++
    ) {
      option.where.push(findOptionsItemTypes[conditionIndex]);
    }
    option.where.concat(findOptionsItemTypes);
    return option;
  }
  public CreateItemTypeConfigTree(
    ItemTypesConfig: DatacenterConfigGenItemsResultDto[],
    parentId: number,
    subItems: DatacenterConfigGenItemsResultDto[] = [],
  ): DatacenterConfigGenItemsResultDto[] {
    const parents = ItemTypesConfig.filter((d) => d.parentId == parentId);
    parents.forEach((e: DatacenterConfigGenItemsResultDto): void => {
      if (e.enabled) {
        const res2: DatacenterConfigGenItemsResultDto[] =
          this.CreateItemTypeConfigTree(ItemTypesConfig, e.id, e.subItems);

        e.subItems.concat(res2);

        subItems.push(e);
      }
    });

    return subItems;
  }

  public GetDtoModelConfigItemDto(
    configs: ItemTypes[],
  ): DatacenterConfigGenItemsResultDto[] {
    const res: DatacenterConfigGenItemsResultDto[] = [];
    configs.forEach((itemTypeConfig): void => {
      res.push(
        new DatacenterConfigGenItemsResultDto(
          itemTypeConfig.id,
          itemTypeConfig.title,
          itemTypeConfig.serviceType.id,
          itemTypeConfig.fee,
          itemTypeConfig.percent,
          itemTypeConfig.minPerRequest,
          itemTypeConfig.maxPerRequest,
          itemTypeConfig.unit,
          itemTypeConfig.parentId,
          itemTypeConfig.step,
          itemTypeConfig.enabled,
        ),
      );
    });
    return res;
  }

  public GetDatacenterConfigSearched(
    tree: DatacenterConfigGenItemsResultDto[],
    query: DatacenterConfigGenItemsQueryDto,
  ): DatacenterConfigGenItemsResultDto[] {
    if (query.GenId == undefined || query.GenId.trim().length == 0) {
      return tree;
    }

    const generationName = 'generation';
    tree.forEach((config) => {
      if (config.itemTypeName.toLowerCase() == generationName) {
        config.subItems = config.subItems.filter(
          (subItemConfig) =>
            subItemConfig.itemTypeName.toLowerCase() ==
            query.GenId.toLowerCase(),
        );
      }
    });

    return tree;
  }
}
