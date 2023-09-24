import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { FindManyOptions, Like } from 'typeorm';
// import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';

@Injectable()
export class DatacenterFactoryService {
  public GetFindOptionBy(
    query: DatacenterConfigGenItemsQueryDto,
  ): FindManyOptions<ItemTypes> {
    const option: FindManyOptions<ItemTypes> = {};
    option.where = {};
    if (
      query.DataCenterId != undefined &&
      query.DataCenterId.trim().length > 0
    ) {
      option.where.datacenterName = Like(`${query.DataCenterId.toLowerCase()}`);
    }
    option.relations = { serviceType: true };
    if (
      query.ServiceTypeId !== undefined &&
      query.ServiceTypeId.trim().length > 0
    ) {
      option.where.serviceType = {
        id: Like(`${query.ServiceTypeId.toLowerCase()}`),
      };
    }

    return option;
  }
  public CreateItemTypeConfigTree(
    ItemTypesConfig: DatacenterConfigGenItemsResultDto[],
    parentId: number,
    subItems: DatacenterConfigGenItemsResultDto[] = [],
  ): DatacenterConfigGenItemsResultDto[] {
    const parents = ItemTypesConfig.filter((d) => d.parentId == parentId);
    parents.forEach((e: DatacenterConfigGenItemsResultDto): void => {
      const res2: DatacenterConfigGenItemsResultDto[] =
        this.CreateItemTypeConfigTree(ItemTypesConfig, e.id, e.subItems);

      e.subItems.concat(res2);

      subItems.push(e);
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
        (datacenterConfig.itemTypeName
          .toLowerCase()
          .includes('g'.toLowerCase()) &&
          datacenterConfig.itemTypeName.trim().toLowerCase() ==
            query.GenId.toLowerCase()) ||
        !regexPattern.test(datacenterConfig.itemTypeName),
    ));
  }
}
