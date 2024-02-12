import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import {
  CreateDatacenterDto,
  Generation,
  GenerationItem,
  GenerationStatus,
  Reservation,
} from '../dto/create-datacenter.dto';
import {
  ItemTypeCodes,
  ItemTypeUnits,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import { And, DataSource, IsNull, Like, Not, QueryRunner } from 'typeorm';
import { CreateItemTypesDto } from '../../crud/item-types-table/dto/create-item-types.dto';
import { CheckConfigsOptions } from '../interface/check-configs.interface';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from '../interface/datacenter.interface';
import { DatacenterService } from './datacenter.service';
import { SessionsService } from '../../sessions/sessions.service';
import { AdminVdcWrapperService } from '../../../../wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { MetaDataDatacenterEnum } from '../enum/meta-data-datacenter-enum';
@Injectable()
export class DatacenterAdminService {
  constructor(
    private readonly itemTypesTableService: ItemTypesTableService,
    @Inject(forwardRef(() => DatacenterService))
    private readonly datacenterService: DatacenterService,
    private readonly datasource: DataSource,
    private readonly sessionsService: SessionsService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
  ) {}
  async createOrUpdatePeriodItems(
    dto: CreateDatacenterDto,
    serviceType: ServiceTypes,
    datacenterName: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const periodItemParentDto: CreateItemTypesDto = {
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
      type: ServicePlanTypeEnum.Static,
      isDeleted: false,
      serviceTypes: {
        datacenterName,
        id: serviceType.id,
      },
      isHidden: false,
      createDate: new Date(),
    };
    const periodItemParent =
      await this.itemTypesTableService.createWithQueryRunner(
        queryRunner,
        periodItemParentDto,
      );
    for (const periodItem of dto.period) {
      const dto: CreateItemTypesDto = {
        code: ItemTypeCodes.PeriodItem,
        type: ServicePlanTypeEnum.Static,
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
        isHidden: false,
      };
      await this.itemTypesTableService.createWithQueryRunner(queryRunner, dto);
    }
  }
  async createOrUpdateCpuReservationItem(
    reservationItems: Reservation[],
    serviceType: ServiceTypes,
    datacenterName: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    try {
      this.checkConfigs(reservationItems, {
        checkMinMax: false,
        checkPercent: true,
        checkPrice: false,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return Promise.reject(err);
    }
    const reservationCpu =
      await this.itemTypesTableService.createWithQueryRunner(queryRunner, {
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
        type: reservationItems[0].type,
        isDeleted: false,
        isHidden: false,
      });
    for (const cpuReservationItem of reservationItems) {
      const dto = {
        code: ItemTypeCodes.CpuReservationItem,
        fee: Number((cpuReservationItem.percent - 1).toPrecision(2)),
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
        isHidden: false,
        type: cpuReservationItem.type,
      };
      await this.itemTypesTableService.createWithQueryRunner(queryRunner, dto);
    }
  }

  async createOrUpdateRamReservationItem(
    reservationItems: Reservation[],
    serviceType: ServiceTypes,
    datacenterName: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    try {
      this.checkConfigs(reservationItems, {
        checkMinMax: false,
        checkPercent: true,
        checkPrice: false,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return Promise.reject(err);
    }
    const reservationRam =
      await this.itemTypesTableService.createWithQueryRunner(queryRunner, {
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
        type: reservationItems[0].type,
        isHidden: false,
      });
    for (const memoryReservationItem of reservationItems) {
      const dto = {
        code: ItemTypeCodes.MemoryReservationItem,
        fee: Number((memoryReservationItem.percent - 1).toPrecision(2)),
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
        type: memoryReservationItem.type,
        isHidden: false,
      };
      await this.itemTypesTableService.createWithQueryRunner(queryRunner, dto);
    }
  }
  async createOrUpdateGenerationItems(
    generationItems: Generation[],
    serviceType: ServiceTypes,
    datacenterName: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const generation = await this.itemTypesTableService.createWithQueryRunner(
      queryRunner,
      {
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
        type: generationItems[0].type,
        isHidden: false,
      },
    );
    for (const generationItem of generationItems) {
      const metaData = await this.datacenterService.getDatacenterMetadata(
        '',
        generationItem.providerId,
      );
      const generationName = metaData.generation as string;
      try {
        this.checkConfigs(generationItem.items.cpu.levels, {
          checkMinMax: true,
          baseMax: generationItem.items.cpu.baseMax,
          baseMin: generationItem.items.cpu.baseMin,
          checkPercent: true,
          checkPrice: false,
          reversePercent: true,
        });
        this.checkConfigs(generationItem.items.ram.levels, {
          checkMinMax: true,
          baseMax: generationItem.items.ram.baseMax,
          baseMin: generationItem.items.ram.baseMin,
          checkPercent: true,
          checkPrice: false,
          reversePercent: true,
        });
      } catch (err) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        return Promise.reject(err);
      }
      const genItem = await this.itemTypesTableService.createWithQueryRunner(
        queryRunner,
        {
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
          type: generationItems[0].type,
          isHidden: false,
        },
      );
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
        type: generationItem.type,
        isHidden: false,
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
        type: generationItem.type,
        isHidden: false,
      };
      const cpuDto = {
        code: VdcGenerationItemCodes.Cpu,
        fee: generationItem.items.cpu.basePrice,
        maxAvailable: null,
        maxPerRequest: generationItem.items.cpu.baseMax,
        minPerRequest: generationItem.items.cpu.baseMin,
        title: VdcGenerationItemCodes.Cpu,
        unit: ItemTypeUnits.Cpu,
        datacenterName,
        enabled: true,
        parentId: genItem.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: generationItem.items.cpu.baseStep,
        isDeleted: false,
        type: generationItem.type,
        isHidden: false,
      };
      const ramDto = {
        code: VdcGenerationItemCodes.Ram,
        fee: generationItem.items.ram.basePrice,
        maxAvailable: null,
        maxPerRequest: generationItem.items.ram.baseMax,
        minPerRequest: generationItem.items.ram.baseMin,
        title: VdcGenerationItemCodes.Ram,
        unit: ItemTypeUnits.Ram,
        datacenterName,
        enabled: true,
        parentId: genItem.id,
        percent: 0,
        required: false,
        rule: null,
        serviceTypeId: serviceType.id,
        step: generationItem.items.ram.baseStep,
        isDeleted: false,
        type: generationItem.type,
        isHidden: false,
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
        type: generationItem.type,
        isHidden: false,
      };
      await this.itemTypesTableService.createWithQueryRunner(
        queryRunner,
        vmDto,
      );
      await this.itemTypesTableService.createWithQueryRunner(
        queryRunner,
        ipDto,
      );
      const cpu = await this.itemTypesTableService.createWithQueryRunner(
        queryRunner,
        cpuDto,
      );
      const ram = await this.itemTypesTableService.createWithQueryRunner(
        queryRunner,
        ramDto,
      );
      const disk = await this.itemTypesTableService.createWithQueryRunner(
        queryRunner,
        diskDto,
      );
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
          step: generationItem.items.cpu.baseStep,
          isDeleted: false,
          type: generationItem.type,
          isHidden: false,
        };
        await this.itemTypesTableService.createWithQueryRunner(
          queryRunner,
          cpuItemDto,
        );
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
          step: generationItem.items.ram.baseStep,
          createDate: new Date(),
          isDeleted: false,
          type: generationItem.type,
          isHidden: false,
        };
        await this.itemTypesTableService.createWithQueryRunner(
          queryRunner,
          ramItemDto,
        );
      }
      for (const diskItem of generationItem.items.diskItems) {
        const diskItemDto: CreateItemTypesDto = {
          code: diskItem.code,
          fee: diskItem.price,
          maxAvailable: null,
          maxPerRequest: diskItem.max,
          minPerRequest: diskItem.min,
          title: `${diskItem.title}-${diskItem.iops}`,
          unit: ItemTypeUnits.Disk,
          datacenterName,
          enabled: diskItem.enabled,
          parentId: disk.id,
          percent: 0,
          required: false,
          rule: null,
          serviceTypeId: serviceType.id,
          step: diskItem.step,
          createDate: new Date(),
          isDeleted: false,
          type: generationItem.type,
          isHidden: diskItem.isHidden,
        };
        await this.itemTypesTableService.createWithQueryRunner(
          queryRunner,
          diskItemDto,
        );
      }
    }
  }

  checkConfigs(
    generationItems: Partial<GenerationItem>[],
    options: CheckConfigsOptions,
  ): void {
    for (let index = 0; index < generationItems.length; index++) {
      if (options.checkMinMax) {
        if (generationItems[0].min !== options.baseMin) {
          throw new BadRequestException('min mismatch');
        } else if (
          index === generationItems.length - 1 &&
          generationItems[generationItems.length - 1].max !== options.baseMax
        ) {
          throw new BadRequestException('max mismatch');
        }
      }

      const checkPercentAndPrice = generationItems.reduce((n, item) => {
        const percentCondition = options.reversePercent
          ? item.percent < n.percent
          : item.percent > n.percent;
        const checkPercent = percentCondition || !options.checkPercent;
        const checkPrice = item.price > n.price || !options.checkPrice;
        const checkMinMax =
          (item.max > n.max && item.min > n.min) || !options.checkMinMax;
        return checkMinMax && checkPercent && checkPrice && item;
      });
      if (!checkPercentAndPrice) {
        throw new BadRequestException('items not sorted');
      }
    }
  }

  async createGuarantyItems(
    datacenterName: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const guarantyItemParents =
      await this.itemTypesTableService.findWithQueryRunner(queryRunner, {
        where: {
          code: And(
            Like(ItemTypeCodes.Guaranty + '%'),
            Not(Like(ItemTypeCodes.GuarantyItem + '%')),
          ),
          datacenterName: IsNull(),
        },
      });
    for (const guarantyItemParent of guarantyItemParents) {
      guarantyItemParent.datacenterName = datacenterName;
      delete guarantyItemParent.id;
      const newGuarantyParent =
        await this.itemTypesTableService.createWithQueryRunner(
          queryRunner,
          guarantyItemParent,
        );

      const guarantyItems =
        await this.itemTypesTableService.findWithQueryRunner(queryRunner, {
          where: {
            code: Like(ItemTypeCodes.GuarantyItem + '%'),
            datacenterName: IsNull(),
          },
        });
      for (const guarantyItem of guarantyItems) {
        guarantyItem.parentId = newGuarantyParent.id;
        guarantyItem.datacenterName = datacenterName;
        delete guarantyItem.id;
        await this.itemTypesTableService.createWithQueryRunner(
          queryRunner,
          guarantyItem,
        );
      }
    }
  }

  async updateGenerationStatus(
    generationStatus: GenerationStatus[],
  ): Promise<void> {
    for (const provider of generationStatus) {
      const adminSession = await this.sessionsService.checkAdminSession();
      const providerList =
        await this.adminVdcWrapperService.getProviderVdcMetadata(
          adminSession,
          provider.providerId,
        );
      for (const providerItem of providerList.metadataEntry) {
        if (providerItem.key === MetaDataDatacenterEnum.Enabled) {
          providerItem.typedValue.value = provider.enabled;
        }
      }
      await this.adminVdcWrapperService.updateProviderMetadata(
        {
          metadataEntry: providerList.metadataEntry,
        },
        adminSession,
        provider.providerId,
      );
    }
  }
}
