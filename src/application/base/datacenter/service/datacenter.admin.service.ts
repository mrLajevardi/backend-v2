import { Injectable } from '@nestjs/common';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { CreateDatacenterDto } from '../dto/create-datacenter.dto';
import {
  ItemTypeCodes,
  ItemTypeUnits,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import { DatacenterOperationTypeEnum } from '../enum/datacenter-opertation-type.enum';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
@Injectable()
export class DatacenterAdminService {
  constructor(private readonly itemTypesTableService: ItemTypesTableService) {}
  async createOrUpdatePeriodItems(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
    type: DatacenterOperationTypeEnum,
  ): Promise<void> {
    const periodItemParentDto = {
      code: ItemTypeCodes.Period,
      fee: 0,
      maxAvailable: null,
      maxPerRequest: null,
      minPerRequest: null,
      title: ItemTypeCodes.Period,
      unit: ItemTypeUnits.PeriodItem,
      enabled: true,
      parentId: 0,
      percent: 0,
      required: false,
      rule: null,
      step: null,
      isDeleted: false,
      serviceType: {
        datacenterName,
        id: serviceType.id,
      },
      createDate: new Date(),
    };
    let periodItemParent: ItemTypes;
    if (type === DatacenterOperationTypeEnum.Create) {
      periodItemParent = await this.itemTypesTableService.create(
        periodItemParentDto,
      );
    } else {
      const firstItem = await this.itemTypesTableService.findById(
        dto.period[0].id,
      );
      periodItemParent = await this.itemTypesTableService.findById(
        firstItem.parentId,
      );
    }
    for (const periodItem of dto.period) {
      const dto = {
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
        isDeleted: false,
      };
      if (type === DatacenterOperationTypeEnum.Create) {
        await this.itemTypesTableService.create(dto);
        return;
      }
      await this.itemTypesTableService.updateAll(
        {
          id: periodItem.id,
        },
        {
          isDeleted: true,
          deleteDate: new Date(),
        },
      );
      await this.itemTypesTableService.create(dto);
    }
  }
  async createOrUpdateCpuReservationItem(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
    type: DatacenterOperationTypeEnum,
  ): Promise<void> {
    let reservationCpu: ItemTypes;
    if (type === DatacenterOperationTypeEnum.Create) {
      reservationCpu = await this.itemTypesTableService.create({
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
        createDate: new Date(),
        isDeleted: false,
      });
    } else {
      const firstItem = await this.itemTypesTableService.findById(
        dto.reservationCpu[0].id,
      );
      reservationCpu = await this.itemTypesTableService.findById(
        firstItem.parentId,
      );
    }

    for (const cpuReservationItem of dto.reservationCpu) {
      const dto = {
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
        isDeleted: false,
      };
      if (type === DatacenterOperationTypeEnum.Create) {
        await this.itemTypesTableService.create(dto);
        return;
      }
      await this.itemTypesTableService.updateAll(
        {
          id: cpuReservationItem.id,
        },
        {
          isDeleted: true,
          deleteDate: new Date(),
        },
      );
      await this.itemTypesTableService.create(dto);
    }
  }

  async createOrUpdateRamReservationItem(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
    type: DatacenterOperationTypeEnum,
  ): Promise<void> {
    let reservationRam: ItemTypes;
    if (type === DatacenterOperationTypeEnum.Create) {
      reservationRam = await this.itemTypesTableService.create({
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
        createDate: new Date(),
        isDeleted: false,
      });
    } else {
      const firstItem = await this.itemTypesTableService.findById(
        dto.reservationRam[0].id,
      );
      reservationRam = await this.itemTypesTableService.findById(
        firstItem.parentId,
      );
    }
    for (const memoryReservationItem of dto.reservationRam) {
      const dto = {
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
        isDeleted: false,
      };
      if (type === DatacenterOperationTypeEnum.Create) {
        await this.itemTypesTableService.create(dto);
        return;
      }
      await this.itemTypesTableService.updateAll(
        {
          id: memoryReservationItem.id,
        },
        {
          deleteDate: new Date(),
          isDeleted: true,
        },
      );
    }
  }
  async createOrUpdateGenerationItems(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
    metaData: FoundDatacenterMetadata,
    type: DatacenterOperationTypeEnum,
  ): Promise<void> {
    let generation: ItemTypes;
    if (type === DatacenterOperationTypeEnum.Create) {
      generation = await this.itemTypesTableService.create({
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
        createDate: new Date(),
        isDeleted: false,
      });
    } else {
      const firstItem = await this.itemTypesTableService.findById(
        dto.generations[0].id,
      );
      generation = await this.itemTypesTableService.findById(
        firstItem.parentId,
      );
    }
    for (const generationItem of dto.generations) {
      const generationName = metaData.generation as string;
      let genItem: ItemTypes;
      if (type === DatacenterOperationTypeEnum.Create) {
        genItem = await this.itemTypesTableService.create({
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
          createDate: new Date(),
          isDeleted: false,
        });
      } else {
        genItem = await this.itemTypesTableService.findById(generationItem.id);
      }
      const vmItem = generationItem.items.vm;
      const ipItem = generationItem.items.ip;
      const vmDto = {
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
        isDeleted: false,
      };
      const ipDto = {
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
        isDeleted: false,
      };
      const cpuDto = {
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
        isDeleted: false,
      };
      const ramDto = {
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
        isDeleted: false,
      };
      const diskDto = {
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
        createDate: new Date(),
        isDeleted: false,
      };
      let cpu: ItemTypes;
      let ram: ItemTypes;
      let disk: ItemTypes;
      if (type === DatacenterOperationTypeEnum.Create) {
        await this.itemTypesTableService.create(vmDto);
        await this.itemTypesTableService.create(ipDto);
        cpu = await this.itemTypesTableService.create(cpuDto);
        ram = await this.itemTypesTableService.create(ramDto);
        disk = await this.itemTypesTableService.create(diskDto);
      } else {
        await this.itemTypesTableService.update(vmItem.id, vmDto);
        await this.itemTypesTableService.update(ipItem.id, ipDto);
        cpu = await this.itemTypesTableService.update(
          generationItem.items.cpu.id,
          cpuDto,
        );
        ram = await this.itemTypesTableService.update(
          generationItem.items.ram.id,
          ramDto,
        );
        const firstDiskItem = await this.itemTypesTableService.findById(
          generationItem.items.diskItems[0].id,
        );
        disk = await this.itemTypesTableService.findById(
          firstDiskItem.parentId,
        );
      }
      for (
        let index = 0;
        index < generationItem.items.cpu.levels.length;
        index++
      ) {
        const cpuItem = generationItem.items.cpu.levels[index];
        const cpuItemDto = {
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
          isDeleted: false,
        };
        if (type === DatacenterOperationTypeEnum.Create) {
          await this.itemTypesTableService.create(cpuItemDto);
        } else {
          await this.itemTypesTableService.update(cpuItem.id, {
            isDeleted: true,
            deleteDate: new Date(),
          });
          await this.itemTypesTableService.create(cpuItemDto);
        }
      }
      for (
        let index = 0;
        index < generationItem.items.ram.levels.length;
        index++
      ) {
        const ramItem = generationItem.items.ram.levels[index];
        const ramItemDto = {
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
          createDate: new Date(),
          isDeleted: false,
        };
        if (type === DatacenterOperationTypeEnum.Create) {
          await this.itemTypesTableService.create(ramItemDto);
        } else {
          await this.itemTypesTableService.update(ramItem.id, {
            isDeleted: true,
            deleteDate: new Date(),
          });
          await this.itemTypesTableService.create(ramItemDto);
        }
      }
      for (const diskItem of generationItem.items.diskItems) {
        const diskItemDto = {
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
          createDate: new Date(),
          isDeleted: false,
        };
        if (type === DatacenterOperationTypeEnum.Create) {
          await this.itemTypesTableService.create(diskItemDto);
        } else {
          await this.itemTypesTableService.update(diskItem.id, {
            isDeleted: true,
            deleteDate: new Date(),
          });
          await this.itemTypesTableService.create(diskItemDto);
        }
      }
    }
  }
}
