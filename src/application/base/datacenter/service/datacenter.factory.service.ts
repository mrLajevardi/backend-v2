import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import {
  And,
  FindManyOptions,
  FindOptionsWhere,
  IsNull,
  Like,
  Not,
} from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';
import {
  GetProviderVdcsDto,
  Value,
} from '../../../../wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs.dto';
import { AdminVdcWrapperService } from '../../../../wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import {
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { plainToInstance } from 'class-transformer';
import {
  ComputeItem,
  CreateDatacenterDto,
  DiskItem,
  Generation,
  GenerationItem,
  GenerationItems,
  Period,
  Reservation,
} from '../dto/create-datacenter.dto';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import _, { keyBy } from 'lodash';
import { DatacenterService } from './datacenter.service';
import { BASE_DATACENTER_SERVICE } from '../interface/datacenter.interface';
import { DatacenterDetails } from '../dto/datacenter-details.dto';
@Injectable()
export class DatacenterFactoryService {
  constructor(
    private readonly serviceItemTypesTreeService: ServiceItemTypesTreeService,
  ) {}
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
          itemTypeConfig.code,
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

  public getModelAllProviders(providerVdcsList: GetProviderVdcsDto) {
    const { values } = providerVdcsList;
    const providerVdcsFilteredData: Pick<Value, 'id'>[] = values.map(
      (value) => {
        const { id, isEnabled } = value;
        if (isEnabled) {
          return { id };
        }
      },
    );
    return providerVdcsFilteredData;
  }

  setPeriodItems(
    item: ServiceItemTypesTree,
    periodItemInstance: Period[],
  ): void {
    const periodItem = plainToInstance(Period, item, {
      excludeExtraneousValues: true,
    });
    periodItemInstance.push(periodItem);
  }

  setReservation(
    item: ServiceItemTypesTree,
    reservationItems: Reservation[],
  ): void {
    const reservationItem = plainToInstance(Reservation, item, {
      excludeExtraneousValues: true,
    });
    reservationItems.push(reservationItem);
  }

  async setGeneration(
    datacenterName: string,
    serviceTypeId: string,
    dsConfig: DatacenterDetails,
  ): Promise<Generation[]> {
    const generations = await this.serviceItemTypesTreeService.find({
      where: {
        datacenterName,
        serviceTypeId,
        code: And(Like('g%'), Not(ItemTypeCodes.Generation)),
      },
    });
    const generationsDto: Generation[] = [];
    for (const generation of generations) {
      const targetDs = dsConfig.gens.find(
        (gen) => gen.name === generation.code,
      );
      if (targetDs == undefined) {
        continue;
      }
      const generationDto: Generation = {
        providerId: targetDs.id,
        type: 0,
        items: {} as GenerationItems,
      };
      const items = await this.serviceItemTypesTreeService.find({
        where: {
          parentId: generation.id,
        },
      });
      for (const item of items) {
        if (item.code === VdcGenerationItemCodes.Cpu) {
          const cpuItem: ComputeItem = {
            baseMax: item.maxPerRequest,
            baseMin: item.minPerRequest,
            basePrice: item.fee,
            levels: [],
          };
          const cpuLevels = await this.serviceItemTypesTreeService.find({
            where: {
              parentId: item.id,
            },
          });
          for (const cpuLevel of cpuLevels) {
            const generationItem = plainToInstance(GenerationItem, cpuLevel, {
              excludeExtraneousValues: true,
            });
            cpuItem.levels.push(generationItem);
          }
          generationDto.items.cpu = cpuItem;
        } else if (item.code === VdcGenerationItemCodes.Ram) {
          const ramItem: ComputeItem = {
            baseMax: item.maxPerRequest,
            baseMin: item.minPerRequest,
            basePrice: item.fee,
            levels: [],
          };
          const ramLevels = await this.serviceItemTypesTreeService.find({
            where: {
              parentId: item.id,
            },
          });
          for (const cpuLevel of ramLevels) {
            const generationItem = plainToInstance(GenerationItem, cpuLevel, {
              excludeExtraneousValues: true,
            });
            ramItem.levels.push(generationItem);
          }
          generationDto.items.ram = ramItem;
        } else if (item.code === VdcGenerationItemCodes.Disk) {
          const diskItems = await this.serviceItemTypesTreeService.find({
            where: {
              parentId: item.id,
            },
          });
          generationDto.items.diskItems = [];
          for (const diskItem of diskItems) {
            const diskItemDto = plainToInstance(DiskItem, diskItem, {
              excludeExtraneousValues: true,
            });
            generationDto.items.diskItems.push(diskItemDto);
          }
        } else if (item.code === VdcGenerationItemCodes.Vm) {
          const vmDto = plainToInstance(GenerationItem, item, {
            excludeExtraneousValues: true,
          });
          generationDto.items.vm = vmDto;
        } else if (item.code === VdcGenerationItemCodes.Ip) {
          const ipDto = plainToInstance(GenerationItem, item, {
            excludeExtraneousValues: true,
          });
          generationDto.items.ip = ipDto;
        }
      }
      generationsDto.push(generationDto);
    }
    return generationsDto;
  }
}
