import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { FindManyOptions, FindOptionsWhere, IsNull, Like } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';
import {
  GetProviderVdcsDto,
  Value,
} from '../../../../wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs.dto';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { GetProviderVdcsMetadataDto } from '../../../../wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { trim } from 'lodash';
import { MetaDataDatacenterEnum } from '../enum/meta-data-datacenter-enum';
import { AdminVdcWrapperService } from '../../../../wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { CreateDatacenterDto } from '../dto/create-datacenter.dto';
import {
  ItemTypeCodes,
  ItemTypeUnits,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';

@Injectable()
export class DatacenterFactoryService {
  constructor(
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly itemTypesTableService: ItemTypesTableService,
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

  async createPeriodItems(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
  ): Promise<void> {
    const periodItemParent = await this.itemTypesTableService.create({
      code: ItemTypeCodes.Period,
      fee: 0,
      maxAvailable: null,
      maxPerRequest: null,
      minPerRequest: null,
      title: ItemTypeCodes.Period,
      unit: ItemTypeUnits.PeriodItem,
      datacenterName,
      enabled: true,
      parentId: 0,
      percent: 0,
      required: false,
      rule: null,
      serviceTypeId: serviceType.id,
      step: null,
    });
    for (const periodItem of dto.period) {
      await this.itemTypesTableService.create({
        code: ItemTypeCodes.PeriodItem,
        fee: 0,
        maxAvailable: null,
        maxPerRequest: periodItem.value,
        minPerRequest: periodItem.value,
        title: periodItem.title,
        unit: ItemTypeUnits.PeriodItem,
        datacenterName,
        enabled: true,
        parentId: periodItemParent.id,
        percent: periodItem.percent,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: 1,
      });
    }
  }
  async createCpuReservationItem(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
  ): Promise<void> {
    const reservationCpu = await this.itemTypesTableService.create({
      code: ItemTypeCodes.CpuReservation,
      fee: 0,
      maxAvailable: null,
      maxPerRequest: null,
      minPerRequest: null,
      title: ItemTypeCodes.CpuReservation,
      unit: ItemTypeUnits.CpuReservation,
      datacenterName,
      enabled: true,
      parentId: 0,
      percent: 0,
      required: false,
      rule: null,
      serviceTypeId: serviceType.id,
      step: null,
    });
    for (const cpuReservationItem of dto.reservationCpu) {
      await this.itemTypesTableService.create({
        code: ItemTypeCodes.CpuReservationItem,
        fee: 0,
        maxAvailable: null,
        maxPerRequest: cpuReservationItem.value,
        minPerRequest: cpuReservationItem.value,
        title: cpuReservationItem.value.toString(),
        unit: ItemTypeUnits.CpuReservation,
        datacenterName,
        enabled: cpuReservationItem.enabled,
        parentId: reservationCpu.id,
        percent: cpuReservationItem.percent,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: 1,
      });
    }
  }

  async createRamReservationItem(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
  ): Promise<void> {
    const reservationRam = await this.itemTypesTableService.create({
      code: ItemTypeCodes.MemoryReservation,
      fee: 0,
      maxAvailable: null,
      maxPerRequest: null,
      minPerRequest: null,
      title: ItemTypeCodes.MemoryReservation,
      unit: ItemTypeUnits.MemoryReservation,
      datacenterName,
      enabled: true,
      parentId: 0,
      percent: 0,
      required: false,
      rule: null,
      serviceTypeId: serviceType.id,
      step: null,
    });
    for (const memoryReservationItem of dto.reservationRam) {
      await this.itemTypesTableService.create({
        code: ItemTypeCodes.MemoryReservationItem,
        fee: 0,
        maxAvailable: null,
        maxPerRequest: memoryReservationItem.value,
        minPerRequest: memoryReservationItem.value,
        title: memoryReservationItem.value.toString(),
        unit: ItemTypeUnits.MemoryReservation,
        datacenterName,
        enabled: memoryReservationItem.enabled,
        parentId: reservationRam.id,
        percent: memoryReservationItem.percent,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: 1,
      });
    }
  }

  async createGenerationItems(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
    metaData: FoundDatacenterMetadata,
  ): Promise<void> {
    const generation = await this.itemTypesTableService.create({
      code: ItemTypeCodes.Generation,
      fee: 0,
      maxAvailable: null,
      maxPerRequest: null,
      minPerRequest: null,
      title: ItemTypeCodes.Generation,
      unit: ItemTypeCodes.Generation,
      datacenterName,
      enabled: true,
      parentId: 0,
      percent: 0,
      required: false,
      rule: null,
      serviceTypeId: serviceType.id,
      step: null,
    });
    for (const generationItem of dto.generations) {
      const generationName = metaData.generation as string;
      const genItem = await this.itemTypesTableService.create({
        code: generationName,
        fee: 0,
        maxAvailable: null,
        maxPerRequest: null,
        minPerRequest: null,
        title: generationName,
        unit: ItemTypeCodes.Generation,
        datacenterName,
        enabled: true,
        parentId: generation.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: null,
      });
      const vmItem = generationItem.items.vm;
      const ipItem = generationItem.items.ip;
      await this.itemTypesTableService.create({
        code: VdcGenerationItemCodes.Vm,
        fee: vmItem.price,
        maxAvailable: null,
        maxPerRequest: vmItem.max,
        minPerRequest: vmItem.min,
        title: VdcGenerationItemCodes.Vm,
        unit: ItemTypeUnits.VmItem,
        datacenterName,
        enabled: true,
        parentId: genItem.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: vmItem.step,
      });
      await this.itemTypesTableService.create({
        code: VdcGenerationItemCodes.Ip,
        fee: ipItem.price,
        maxAvailable: null,
        maxPerRequest: ipItem.max,
        minPerRequest: ipItem.min,
        title: VdcGenerationItemCodes.Ip,
        unit: ItemTypeUnits.Ip,
        datacenterName,
        enabled: true,
        parentId: genItem.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: ipItem.step,
      });
      const cpu = await this.itemTypesTableService.create({
        code: VdcGenerationItemCodes.Cpu,
        fee: generationItem.items.cpu.basePrice,
        maxAvailable: null,
        maxPerRequest: null,
        minPerRequest: null,
        title: VdcGenerationItemCodes.Cpu,
        unit: ItemTypeUnits.Cpu,
        datacenterName,
        enabled: true,
        parentId: genItem.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: null,
      });
      for (
        let index = 0;
        index < generationItem.items.cpu.levels.length;
        index++
      ) {
        const cpuItem = generationItem.items.cpu.levels[index];
        await this.itemTypesTableService.create({
          code: 'l' + index,
          fee: 0,
          maxAvailable: null,
          maxPerRequest: cpuItem.max,
          minPerRequest: cpuItem.min,
          title: 'L' + index,
          unit: ItemTypeUnits.Cpu,
          datacenterName,
          enabled: true,
          parentId: cpu.id,
          percent: cpuItem.percent,
          required: false,
          rule: null,
          serviceTypeId: serviceType.id,
          step: cpuItem.step,
        });
      }
      const ram = await this.itemTypesTableService.create({
        code: VdcGenerationItemCodes.Ram,
        fee: generationItem.items.ram.basePrice,
        maxAvailable: null,
        maxPerRequest: null,
        minPerRequest: null,
        title: VdcGenerationItemCodes.Ram,
        unit: ItemTypeUnits.Ram,
        datacenterName,
        enabled: true,
        parentId: genItem.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: null,
      });
      for (
        let index = 0;
        index < generationItem.items.ram.levels.length;
        index++
      ) {
        const ramItem = generationItem.items.ram.levels[index];
        await this.itemTypesTableService.create({
          code: 'l' + index,
          fee: 0,
          maxAvailable: null,
          maxPerRequest: ramItem.max,
          minPerRequest: ramItem.min,
          title: 'L' + index,
          unit: ItemTypeUnits.Ram,
          datacenterName,
          enabled: true,
          parentId: ram.id,
          percent: ramItem.percent,
          required: false,
          rule: null,
          serviceTypeId: serviceType.id,
          step: ramItem.step,
        });
      }
      const disk = await this.itemTypesTableService.create({
        code: VdcGenerationItemCodes.Disk,
        fee: 0,
        maxAvailable: null,
        maxPerRequest: null,
        minPerRequest: null,
        title: VdcGenerationItemCodes.Disk,
        unit: ItemTypeUnits.Disk,
        datacenterName,
        enabled: true,
        parentId: genItem.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: null,
      });
      for (const diskItem of generationItem.items.diskItems) {
        await this.itemTypesTableService.create({
          code: diskItem.code,
          fee: diskItem.price,
          maxAvailable: null,
          maxPerRequest: diskItem.max,
          minPerRequest: diskItem.min,
          title: VdcGenerationItemCodes.Disk,
          unit: ItemTypeUnits.Disk,
          datacenterName,
          enabled: diskItem.enabled,
          parentId: disk.id,
          percent: 0,
          required: false,
          rule: null,
          serviceTypeId: serviceType.id,
          step: null,
        });
      }
    }
  }
}
