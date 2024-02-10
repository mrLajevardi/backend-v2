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
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import {
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { plainToInstance } from 'class-transformer';
import {
  ComputeItem,
  DiskItem,
  Generation,
  GenerationItem,
  GenerationItems,
  Period,
  Reservation,
} from '../dto/create-datacenter.dto';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { DatacenterDetails } from '../dto/datacenter-details.dto';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { capitalize, isEmpty } from 'lodash';
@Injectable()
export class DatacenterFactoryService {
  constructor(
    private readonly serviceItemTypesTreeService: ServiceItemTypesTreeService,
  ) {}
  public GetFindOptionBy(
    query: DatacenterConfigGenItemsQueryDto,
  ): FindManyOptions<ItemTypes> {
    const option: FindManyOptions<ItemTypes> = {};

    const findOptionsItemTypes: FindOptionsWhere<ItemTypes>[] = [];
    option.where = [];
    this.getItemTypesRule(query, findOptionsItemTypes, option);
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

  private getItemTypesRule(
    query: DatacenterConfigGenItemsQueryDto,
    findOptionsItemTypes: FindOptionsWhere<ItemTypes>[],
    option: FindManyOptions<ItemTypes>,
  ) {
    if (
      query.DataCenterId != undefined &&
      query.DataCenterId.trim().length > 0
    ) {
      findOptionsItemTypes.push({
        datacenterName: Like(`${query.DataCenterId.toLowerCase()}`),
        type: query.ServicePlanType,
        isDeleted: false,
      });
    }
    option.relations = { serviceType: true };
    if (
      query.ServiceTypeId !== undefined &&
      query.ServiceTypeId.trim().length > 0
    ) {
      findOptionsItemTypes.push({
        serviceTypeId: Like(`${query.ServiceTypeId.toLowerCase()}`),
        type: query.ServicePlanType,
        isDeleted: false,
      });
    }
  }

  public CreateItemTypeConfigTree(
    ItemTypesConfig: DatacenterConfigGenItemsResultDto[],
    parentId: number,
    subItems: DatacenterConfigGenItemsResultDto[] = [],
  ): DatacenterConfigGenItemsResultDto[] {
    const parents = ItemTypesConfig.filter((d) => d.parentId == parentId);
    parents.forEach((e: DatacenterConfigGenItemsResultDto): void => {
      if (!e.isHidden) {
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
          itemTypeConfig.isHidden,
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
    periodItem.value = item.minPerRequest;
    periodItemInstance.push(periodItem);
  }

  setReservation(
    item: ServiceItemTypesTree,
    reservationItems: Reservation[],
  ): void {
    const reservationItem = plainToInstance(Reservation, item, {
      excludeExtraneousValues: true,
    });
    reservationItem.value = item.minPerRequest;
    reservationItems.push(reservationItem);
  }

  async setGeneration(
    datacenterName: string | null,
    serviceTypeId: string,
    dsConfig: DatacenterConfigGenResultDto,
    type: ServicePlanTypeEnum,
  ): Promise<Generation[]> {
    const codeCondition =
      datacenterName !== null
        ? And(
            Like('g%'),
            Not(ItemTypeCodes.Generation),
            Not(Like(ItemTypeCodes.Guaranty + '%')),
          )
        : ItemTypeCodes.Generation;
    console.log({
      datacenterName: datacenterName || capitalize(datacenterName),
      serviceTypeId,
      isDeleted: false,
      type,
      code: codeCondition,
    });
    const datacenterCondition =
      datacenterName !== null ? capitalize(datacenterName) : datacenterName;
    const generations = await this.serviceItemTypesTreeService.find({
      where: {
        datacenterName: datacenterCondition,
        serviceTypeId,
        isDeleted: false,
        type,
        code: codeCondition,
      },
    });
    const generationsDto: Generation[] = [];
    for (const generation of generations) {
      const targetDs = !datacenterName
        ? null
        : dsConfig.gens.find((gen) => gen.name === generation.code);
      const generationDto: Generation = {
        enabled: false,
        providerId: targetDs?.id || null,
        type,
        items: {} as GenerationItems,
        name: targetDs?.name.toString() ?? null,
      };
      const items = await this.serviceItemTypesTreeService.find({
        where: {
          parentId: generation.id,
          isDeleted: false,
        },
      });
      for (const item of items) {
        if (item.code === VdcGenerationItemCodes.Cpu) {
          const cpuItem: ComputeItem = {
            baseMax: item.maxPerRequest,
            baseMin: item.minPerRequest,
            basePrice: item.fee,
            baseStep: item.step,
            levels: [],
          };
          const cpuLevels = await this.serviceItemTypesTreeService.find({
            where: {
              parentId: item.id,
              isDeleted: false,
            },
          });
          for (const cpuLevel of cpuLevels) {
            const generationItem: GenerationItem = {
              code: cpuLevel.code,
              max: cpuLevel.maxPerRequest,
              min: cpuLevel.minPerRequest,
              step: cpuLevel.step,
              percent: cpuLevel.percent,
              price: cpuLevel.fee,
            };
            cpuItem.levels.push(generationItem);
          }
          generationDto.items.cpu = cpuItem;
        } else if (item.code === VdcGenerationItemCodes.Ram) {
          const ramItem: ComputeItem = {
            baseMax: item.maxPerRequest,
            baseMin: item.minPerRequest,
            basePrice: item.fee,
            baseStep: item.step,
            levels: [],
          };
          const ramLevels = await this.serviceItemTypesTreeService.find({
            where: {
              parentId: item.id,
              isDeleted: false,
            },
          });
          for (const ramLevel of ramLevels) {
            const generationItem: GenerationItem = {
              code: ramLevel.code,
              max: ramLevel.maxPerRequest,
              min: ramLevel.minPerRequest,
              step: ramLevel.step,
              percent: ramLevel.percent,
              price: ramLevel.fee,
            };
            ramItem.levels.push(generationItem);
          }
          generationDto.items.ram = ramItem;
        } else if (item.code === VdcGenerationItemCodes.Disk) {
          const diskItems = await this.serviceItemTypesTreeService.find({
            where: {
              parentId: item.id,
              isDeleted: false,
            },
          });
          generationDto.items.diskItems = [];
          for (const diskItem of diskItems) {
            const diskItemDto: DiskItem = {
              code: diskItem.code,
              enabled: diskItem.enabled,
              max: diskItem.maxPerRequest,
              min: diskItem.minPerRequest,
              price: diskItem.fee,
              step: diskItem.step,
              percent: diskItem.percent,
              title: diskItem.title.split('-')[0],
              isHidden: diskItem.isHidden,
              iops: Number(diskItem.title.split('-')[1]),
            };
            generationDto.items.diskItems.push(diskItemDto);
          }
        } else if (item.code === VdcGenerationItemCodes.Vm) {
          const vmDto: GenerationItem = {
            code: item.code,
            max: item.maxPerRequest,
            min: item.minPerRequest,
            step: item.step,
            percent: item.percent,
            price: item.fee,
          };
          generationDto.items.vm = vmDto;
        } else if (item.code === VdcGenerationItemCodes.Ip) {
          const ipDto: GenerationItem = {
            code: item.code,
            max: item.maxPerRequest,
            min: item.minPerRequest,
            step: item.step,
            percent: item.percent,
            price: item.fee,
          };
          generationDto.items.ip = ipDto;
        }
      }
      generationsDto.push(generationDto);
    }
    return generationsDto;
  }
}
