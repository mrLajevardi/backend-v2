import { BaseService } from '../../../../infrastructure/service/BaseService';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import { And, FindManyOptions, IsNull, Like, MoreThan, Not } from 'typeorm';
import { DatacenterFactoryService } from './datacenter.factory.service';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { SessionsService } from '../../sessions/sessions.service';
import {
  GetProviderVdcsDto,
  Value,
} from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs.dto';
import { GetProviderVdcsMetadataDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { BaseDatacenterService } from '../interface/datacenter.interface';
import { capitalize, forEach, trim } from 'lodash';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';
import { MetaDataDatacenterEnum } from '../enum/meta-data-datacenter-enum';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { isNil } from 'lodash';

import {
  CreateDatacenterDto,
  Generation,
  Period,
  Reservation,
} from '../dto/create-datacenter.dto';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { DatacenterAdminService } from './datacenter.admin.service';
import { DatacenterOperationTypeEnum } from '../enum/datacenter-opertation-type.enum';
import { InvoiceFactoryService } from '../../invoice/service/invoice-factory.service';
import { InvoiceItemsDto } from '../../invoice/dto/create-service-invoice.dto';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import {
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { GetDatacenterConfigsQueryDto } from '../dto/get-datacenter-configs.dto';
import {
  ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
  PROVIDER_SPLITTER,
} from '../../itemType/const/item-type-code-hierarchy.const';
import { VcloudMetadata } from '../type/vcloud-metadata.type';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { VdcWrapperService } from 'src/wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { ProviderVdcStorageProfilesDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/provider-vdc-storage-profile.dto';
import { AdminOrgVdcStorageProfileQuery } from '../../../../wrappers/main-wrapper/service/user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { GetCodeDisk } from '../../../vdc/utils/disk-functions.utils';
import { distinctByProperty } from '../../../../infrastructure/utils/extensions/array.extensions';
import { groupBy } from '../../../../infrastructure/utils/extensions/array.extensions';
import { ProviderResultDto } from '../dto/provider.result.dto';

@Injectable()
export class DatacenterService implements BaseDatacenterService, BaseService {
  constructor(
    private readonly dataCenterTableService: DataCenterTableService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly sessionsService: SessionsService,
    @Inject(forwardRef(() => DatacenterFactoryService))
    private readonly datacenterServiceFactory: DatacenterFactoryService,
    private readonly serviceTypesTableService: ServiceTypesTableService,
    private readonly datacenterAdminService: DatacenterAdminService,
    private readonly itemTypeTableService: ItemTypesTableService,
    private readonly serviceItemTypesTreeService: ServiceItemTypesTreeService,
    private readonly vdcWrapperService: VdcWrapperService,
  ) {}

  async getDatacenterMetadata(
    datacenterName: string,
    genId: string,
    filterEnabled = true,
  ): Promise<FoundDatacenterMetadata> {
    const adminToken: string = await this.sessionsService.checkAdminSession();
    const metadata = await this.adminVdcWrapperService.getProviderVdcMetadata(
      adminToken,
      genId,
    );
    const res: FoundDatacenterMetadata = this.findTargetMetadata(
      metadata,
      filterEnabled,
    );
    return res;
  }

  public findTargetMetadata(
    metadata: GetProviderVdcsMetadataDto,
    filterEnabled = true,
  ): FoundDatacenterMetadata {
    const targetMetadata: FoundDatacenterMetadata = {
      datacenter: null,
      generation: null,
      datacenterTitle: null,
      cpuSpeed: null,
      location: null,
      enabled: null,
    };

    for (const value of metadata.metadataEntry) {
      const key = value.key;

      const metadataValue =
        value.typedValue._type === 'MetadataStringValue'
          ? trim(value.typedValue.value.toString()).toLowerCase()
          : value.typedValue.value;
      if (
        value.key === MetaDataDatacenterEnum.Enabled &&
        !value.typedValue.value &&
        filterEnabled
      ) {
        return {
          datacenter: null,
          generation: null,
          datacenterTitle: null,
          cpuSpeed: null,
          enabled: false,
          location: null,
        };
      }
      switch (key) {
        case MetaDataDatacenterEnum.Generation:
          targetMetadata.generation = metadataValue;
          break;
        case MetaDataDatacenterEnum.Datacenter:
          targetMetadata.datacenter = metadataValue;
          break;
        case MetaDataDatacenterEnum.DatacenterTitle:
          targetMetadata.datacenterTitle = metadataValue;
          break;
        case MetaDataDatacenterEnum.CpuSpeed:
          targetMetadata.cpuSpeed = metadataValue;
          break;
        case MetaDataDatacenterEnum.Enabled:
          targetMetadata.enabled = metadataValue as boolean;
          break;
        case MetaDataDatacenterEnum.Location:
          targetMetadata.location = metadataValue as string;
          break;
      }
    }
    return targetMetadata;
  }

  // public findAllTargetMetadata(
  //   metadata: GetProviderVdcsMetadataDto,
  // ): FoundDatacenterMetadata {
  //   const targetMetadata: FoundDatacenterMetadata = {
  //     datacenter: null,
  //     generation: null,
  //     datacenterTitle: null,
  //     cpuSpeed: null,
  //     enabled: null,
  //     location: null,
  //   };
  //
  //   for (const value of metadata.metadataEntry) {
  //     const key = value.key;
  //
  //     const metadataValue =
  //       value.typedValue._type === 'MetadataStringValue'
  //         ? trim(value.typedValue.value.toString()).toLowerCase()
  //         : value.typedValue.value;
  //
  //     switch (key) {
  //       case MetaDataDatacenterEnum.Generation:
  //         targetMetadata.generation = metadataValue;
  //         break;
  //       case MetaDataDatacenterEnum.Datacenter:
  //         targetMetadata.datacenter = metadataValue;
  //         break;
  //       case MetaDataDatacenterEnum.DatacenterTitle:
  //         targetMetadata.datacenterTitle = metadataValue;
  //         break;
  //       case MetaDataDatacenterEnum.CpuSpeed:
  //         targetMetadata.cpuSpeed = metadataValue;
  //         break;
  //       case MetaDataDatacenterEnum.Enabled:
  //         targetMetadata.enabled = metadataValue as boolean;
  //         break;
  //       case MetaDataDatacenterEnum.Location:
  //         targetMetadata.location = metadataValue as string;
  //         break;
  //     }
  //   }
  //   return targetMetadata;
  // }

  public async getAllProviders(): Promise<ProviderResultDto[]> {
    const adminSession = await this.sessionsService.checkAdminSession();
    const params = {
      page: 1,
      pageSize: 10,
    };
    const providerVdcsList = await this.adminVdcWrapperService.getProviderVdcs(
      adminSession,
      params,
    );
    const res = providerVdcsList?.values?.map((provider) => {
      const splits = provider.name?.split(PROVIDER_SPLITTER);
      const providerName = splits[0];
      // const gen = `${splits[1]}-${splits[2]}`;
      const gen = `${splits[1]}`;
      return { name: providerName, gen, id: provider.id };
    });

    const resGroup: Record<
      string,
      { name: string; gen: string; id: string }[]
    > = groupBy(res, (res) => res.name);

    const fRes: { name: string; gens: { name: string; id: string }[] }[] = [];
    for (const obj of Object.keys(resGroup)) {
      const gens = resGroup[obj].map((d) => {
        return { name: d.gen, id: d.id };
      });
      fRes.push({ name: obj, gens: gens });
      console.log(obj);
    }

    return fRes;
  }

  public async getDatacenterConfigWithGen(
    datacenterName?: string,
    filter = true,
  ): Promise<DatacenterConfigGenResultDto[]> {
    const adminSession = await this.sessionsService.checkAdminSession();
    const params = {
      page: 1,
      pageSize: 10,
    };
    const providerVdcsList = await this.adminVdcWrapperService.getProviderVdcs(
      adminSession,
      params,
    );
    const providerVdcsFilteredData =
      this.getModelAllProviders(providerVdcsList);
    const datacenterConfigs: DatacenterConfigGenResultDto[] = [];

    // console.log("provider:  ",providerVdcsFilteredData);

    await this.configProvider(
      providerVdcsFilteredData,
      adminSession,
      datacenterConfigs,
      datacenterName,
      filter,
    );

    // console.log("datacenterConfigs:  ",datacenterConfigs)

    return datacenterConfigs;
  }

  private getModelAllProviders(providerVdcsList: GetProviderVdcsDto) {
    const { values } = providerVdcsList;
    const providerVdcsFilteredData = [];
    for (const item of values) {
      if (item.isEnabled) {
        providerVdcsFilteredData.push({ id: item.id });
      }
    }

    return providerVdcsFilteredData;
  }

  // private getAllProviders(providerVdcsList: GetProviderVdcsDto) {
  //   const providerIdList = [];
  //
  //   const { values } = providerVdcsList;
  //   const providerVdcsFilteredData: Pick<Value, 'id'>[] = values.map(
  //     (value) => {
  //       const { id } = value;
  //       return { id };
  //     },
  //   );
  //   return providerVdcsFilteredData;
  // }

  private async configProvider(
    providerVdcsFilteredData: Pick<Value, 'id'>[],
    adminSession: string,
    datacenterConfigs: DatacenterConfigGenResultDto[],
    dataCenterName = '',
    filter = true,
  ) {
    for (const providerVdc of providerVdcsFilteredData) {
      const metadata = await this.adminVdcWrapperService.getProviderVdcMetadata(
        adminSession,
        providerVdc.id,
      );

      // console.log("metadata:  ",metadata);

      const targetMetadata = this.findTargetMetadata(metadata, filter);
      if (targetMetadata.datacenter === null) {
        continue;
      }
      // console.log("targetMetadata:  ",targetMetadata);

      const targetConfig = datacenterConfigs.find((value) => {
        return value.datacenter === targetMetadata.datacenter;
      });
      const newGen = {
        name: targetMetadata.generation,
        id: providerVdc.id,
        enable: targetMetadata.enabled,
      };
      if (!targetConfig) {
        const storageProfiles =
          await this.vdcWrapperService.vcloudQuery<ProviderVdcStorageProfilesDto>(
            adminSession,
            {
              type: 'providerVdcStorageProfile',
              format: 'records',
              page: 1,
              pageSize: 15,
              sortAsc: 'name',
              filter: `isEnabled==true;providerVdc==${
                providerVdc.id.split(':').slice(-1)[0]
              }`,
            },
          );
        const filteredProviderVdc = storageProfiles.data.record.map(
          (profile) => {
            const id = profile.href.split('/').slice(-1)[0];
            return {
              id,
              name: profile.name,
            };
          },
        );
        const config: DatacenterConfigGenResultDto = {
          datacenter: targetMetadata.datacenter,
          enabled: true,
          enabledForBusiness: false,
          title: targetMetadata.datacenterTitle,
          location: targetMetadata.location,
          gens: [newGen],
          storagePolicies: filteredProviderVdc,
        };

        // console.log("config:  ",config);

        // Should Be Refactor  ==> ZARE
        if (!isNil(dataCenterName) && dataCenterName.length > 0) {
          if (
            (config.datacenter as string).toLowerCase().trim() ==
            dataCenterName.toLowerCase().trim()
          ) {
            datacenterConfigs.push(config);
          }
        } else {
          datacenterConfigs.push(config);
        }
      } else {
        targetConfig.gens.push(newGen);
        targetConfig.enabledForBusiness =
          targetConfig.enabledForBusiness || newGen.enable;
      }
    }
  }

  async GetDatacenterConfigWithGenItems(
    query: DatacenterConfigGenItemsQueryDto,
  ): Promise<DatacenterConfigGenItemsResultDto[]> {
    const option: FindManyOptions<ItemTypes> =
      this.datacenterServiceFactory.GetFindOptionBy(query);

    const configs: ItemTypes[] = await this.dataCenterTableService.find(option);

    const models: DatacenterConfigGenItemsResultDto[] =
      this.datacenterServiceFactory.GetDtoModelConfigItemDto(configs);

    let tree: DatacenterConfigGenItemsResultDto[] =
      this.datacenterServiceFactory.CreateItemTypeConfigTree(models, 0);

    tree = this.datacenterServiceFactory.GetDatacenterConfigSearched(
      tree,
      query,
    );

    return Promise.resolve(tree);
  }

  // async getAllDataCenters(): Promise<DataCenterList[]> {
  //   const adminSession = await this.sessionsService.checkAdminSession();
  //   const params = {
  //     page: 1,
  //     pageSize: 10,
  //   };
  //
  //   const providerVdcsList = await this.adminVdcWrapperService.getProviderVdcs(
  //     adminSession,
  //     params,
  //   );
  //
  //   const providerVdcsFilteredData = this.getAllProviders(providerVdcsList);
  //
  //   const dataCenterList: DataCenterList[] = [];
  //
  //   let index = 0;
  //   for (const providerVdc of providerVdcsFilteredData) {
  //     index = index + 1;
  //     const metadata = await this.adminVdcWrapperService.getProviderVdcMetadata(
  //       adminSession,
  //       providerVdc.id,
  //     );
  //     const targetMetadata = this.findAllTargetMetadata(metadata);
  //     if (targetMetadata.datacenter === null) {
  //       index = index - 1;
  //       continue;
  //     }
  //
  //     const targetConfig = dataCenterList.find((value) => {
  //       return value.datacenter === targetMetadata.datacenter;
  //     });
  //     const newGen = {
  //       name: targetMetadata.generation as string,
  //       id: providerVdc.id,
  //       enabled: targetMetadata.enabled,
  //       cpuSpeed: targetMetadata.cpuSpeed,
  //     };
  //     const enabled = await this.GetDatacenterConfigWithGenItems({
  //       DataCenterId: providerVdc.id,
  //       GenId: '',
  //       ServiceTypeId: '',
  //     });
  //     if (!targetConfig) {
  //       const config: DataCenterList = {
  //         datacenter: targetMetadata.datacenter,
  //         datacenterTitle: targetMetadata.datacenterTitle,
  //         gens: [newGen],
  //         enabled: enabled[0].enabled,
  //         location: targetMetadata.location,
  //         number: index,
  //       };
  //
  //       dataCenterList.push(config);
  //     } else {
  //       targetConfig.gens.push(newGen);
  //     }
  //   }
  //   return Promise.resolve(dataCenterList);
  // }

  // async getDatacenterDetails(
  //   datacenterName: string,
  // ): Promise<DatacenterDetails> {
  //   const result = await this.GetDatacenterConfigWithGenItems(
  //     new DatacenterConfigGenItemsQueryDto(datacenterName, '', ''),
  //   );
  //
  //   const disks = result[1].subItems[0].subItems[1].subItems;
  //   const diskList: DiskList[] = [];
  //
  //   for (let i = 0; i < disks.length; i++) {
  //     const res = {
  //       itemTypeName: disks[i].itemTypeName,
  //       enabled: disks[i].enabled,
  //     };
  //     diskList.push(res);
  //   }
  //
  //   const periods = result[3].subItems;
  //
  //   const periodList: PeriodList[] = [];
  //
  //   for (let i = 0; i < periods.length; i++) {
  //     const res = {
  //       itemTypeName: periods[i].itemTypeName,
  //       price: periods[i].price,
  //       unit: periods[i].unit,
  //       enabled: periods[i].enabled,
  //     };
  //     periodList.push(res);
  //   }
  //
  //   const datacenterInf = [];
  //
  //   const allDatacenters = await this.getAllDataCenters();
  //
  //   for (let i = 0; i < allDatacenters.length; i++) {
  //     if (allDatacenters[i].datacenter === datacenterName) {
  //       const gen: GenDto[] = [];
  //       for (let j = 0; j < allDatacenters[i].gens.length; j++) {
  //         const res = {
  //           name: allDatacenters[i].gens[j].name,
  //           enabled: allDatacenters[i].gens[j].enabled,
  //           cpuSpeed: allDatacenters[i].gens[j].cpuSpeed,
  //           id: allDatacenters[i].gens[j].id,
  //         };
  //         gen.push(res);
  //       }
  //       datacenterInf.push(gen);
  //       datacenterInf.push(allDatacenters[i].location);
  //       datacenterInf.push(allDatacenters[i].datacenterTitle);
  //     }
  //   }
  //
  //   const providersGen = [];
  //
  //   for (let i = 0; i < datacenterInf[0].length; i++) {
  //     const res = {
  //       genName: datacenterInf[0][i].name,
  //       genCpuSpeed: datacenterInf[0][i].cpuSpeed,
  //     };
  //     providersGen.push(res);
  //   }
  //
  //   console.log(datacenterInf);
  //   const datacenterDetails: any = {
  //     name: datacenterName,
  //     // title: datacenterInf
  //     diskList,
  //     periodList,
  //     enabled: result[0].enabled,
  //     location: datacenterInf[1],
  //     title: datacenterInf[2],
  //     gens: datacenterInf[0],
  //     providers: `${datacenterName}-(${providersGen[0].genName}-${
  //       providersGen[0].genCpuSpeed / 1000
  //     }/${providersGen[1].genName}-${providersGen[1].genCpuSpeed / 1000})`,
  //   };
  //
  //   return Promise.resolve(datacenterDetails);
  // }

  async createDatacenter(dto: CreateDatacenterDto): Promise<void> {
    let generation = dto.staticGenerations;
    if (generation.length === 0) {
      generation = dto.paygGenerations;
    }
    await this.updateDatacenterMetadata(generation, dto.location, dto.title);
    const datacenter = await this.getDatacenterMetadata(
      '',
      generation[0].providerId,
      false,
    );
    const datacenterName = datacenter.datacenter as string;
    const serviceType = await this.serviceTypesTableService.create({
      baseFee: 0,
      createInstanceScript: '',
      isPayg: false,
      maxAvailable: 10000,
      title: dto.title,
      verifyInstance: false,
      id: ServiceTypesEnum.Vdc,
      paygInterval: null,
      paygScript: '',
      type: 0,
      datacenterName,
    });
    const queryRunner = await this.itemTypeTableService.getQueryRunner();
    await queryRunner.startTransaction();
    await this.datacenterAdminService.createGuarantyItems(
      datacenterName,
      queryRunner,
    );

    await this.datacenterAdminService.createOrUpdatePeriodItems(
      dto,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateCpuReservationItem(
      dto.paygReservationCpu,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateCpuReservationItem(
      dto.staticReservationCpu,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateRamReservationItem(
      dto.paygReservationRam,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateRamReservationItem(
      dto.staticReservationRam,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateGenerationItems(
      dto.staticGenerations,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateGenerationItems(
      dto.paygGenerations,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await queryRunner.commitTransaction();
    await queryRunner.release();
    await this.datacenterAdminService.updateGenerationStatus(
      dto.generationsStatus,
    );
  }

  async updateDatacenterMetadata(
    dto: Generation[],
    location: string,
    title: string,
  ): Promise<void> {
    for (const provider of dto) {
      const adminSession = await this.sessionsService.checkAdminSession();
      const providerList =
        await this.adminVdcWrapperService.getProviderVdcMetadata(
          adminSession,
          provider.providerId,
        );
      for (const providerItem of providerList.metadataEntry) {
        if (providerItem.key === MetaDataDatacenterEnum.Location) {
          providerItem.typedValue.value = location;
        } else if (
          providerItem.key === MetaDataDatacenterEnum.DatacenterTitle
        ) {
          providerItem.typedValue.value = title;
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

  async updateDatacenter(dto: CreateDatacenterDto): Promise<void> {
    const serviceType = await this.serviceTypesTableService.findById('vdc');
    let generation = dto.staticGenerations;
    if (generation.length === 0) {
      generation = dto.paygGenerations;
    }
    await this.updateDatacenterMetadata(generation, dto.location, dto.title);
    const datacenter = await this.getDatacenterMetadata(
      '',
      generation[0].providerId,
      false,
    );
    const datacenterName = datacenter.datacenter as string;
    const queryRunner = await this.itemTypeTableService.getQueryRunner();
    await queryRunner.startTransaction();
    await this.itemTypeTableService.updateWithQueryRunner(
      queryRunner,
      {
        datacenterName: Like(`${datacenterName}%`),
        code: And(
          Not(Like(ItemTypeCodes.Guaranty + '%')),
          Not(Like(ItemTypeCodes.GuarantyItem + '%')),
        ),
      },
      {
        deleteDate: new Date(),
        isDeleted: true,
      },
    );
    await this.datacenterAdminService.createOrUpdatePeriodItems(
      dto,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateCpuReservationItem(
      dto.paygReservationCpu,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateCpuReservationItem(
      dto.staticReservationCpu,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateRamReservationItem(
      dto.paygReservationRam,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateRamReservationItem(
      dto.staticReservationRam,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateGenerationItems(
      dto.paygGenerations,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateGenerationItems(
      dto.staticGenerations,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await queryRunner.commitTransaction();
    await queryRunner.release();
    await this.datacenterAdminService.updateGenerationStatus(
      dto.generationsStatus,
    );
  }

  async getDatacenterConfigs(
    query: GetDatacenterConfigsQueryDto,
  ): Promise<CreateDatacenterDto> {
    const { serviceTypeId } = query;
    const datacenterName = query?.datacenterName || null;
    const dsConfig = datacenterName
      ? (await this.getDatacenterConfigWithGen('', false)).find(
          (item) => item.datacenter === datacenterName.toLowerCase(),
        )
      : null;
    const datacenterCondition =
      datacenterName !== null ? capitalize(datacenterName) : datacenterName;
    const itemTypes = await this.serviceItemTypesTreeService.find({
      where: {
        datacenterName: datacenterCondition,
        serviceTypeId,
        isDeleted: false,
        codeHierarchy: And(
          Not(Like(ItemTypeCodes.Guaranty + '%')),
          Not(Like(ItemTypeCodes.Generation + '%')),
        ),
      },
    });
    const periodItems: Period[] = [];
    const reservationCpuItems: Reservation[] = [];
    const reservationRamItems: Reservation[] = [];
    for (const itemType of itemTypes) {
      const parents = itemType.codeHierarchy.split(
        ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
      );
      switch (parents[1]) {
        case ItemTypeCodes.PeriodItem:
          this.datacenterServiceFactory.setPeriodItems(itemType, periodItems);
          break;
        case ItemTypeCodes.CpuReservationItem:
          this.datacenterServiceFactory.setReservation(
            itemType,
            reservationCpuItems,
          );
          break;
        case ItemTypeCodes.MemoryReservationItem:
          this.datacenterServiceFactory.setReservation(
            itemType,
            reservationRamItems,
          );
          break;
      }
    }
    const paygGenerations = await this.datacenterServiceFactory.setGeneration(
      datacenterName,
      serviceTypeId,
      dsConfig,
      ServicePlanTypeEnum.Payg,
    );
    const staticGenerations = await this.datacenterServiceFactory.setGeneration(
      datacenterName,
      serviceTypeId,
      dsConfig,
      ServicePlanTypeEnum.Static,
    );
    const generationsStatus =
      this.datacenterServiceFactory.setGenerationStatus(dsConfig);
    const datacenter: CreateDatacenterDto = {
      paygReservationCpu: reservationCpuItems.filter(
        (item) => item.type === ServicePlanTypeEnum.Payg,
      ),
      staticReservationCpu: reservationCpuItems.filter(
        (item) => item.type === ServicePlanTypeEnum.Static,
      ),
      paygReservationRam: reservationRamItems.filter(
        (item) => item.type === ServicePlanTypeEnum.Payg,
      ),
      staticReservationRam: reservationRamItems.filter(
        (item) => item.type === ServicePlanTypeEnum.Static,
      ),
      paygGenerations,
      staticGenerations,
      period: periodItems,
      generationsStatus,
      title: (dsConfig?.title as string) || null,
      location: (dsConfig?.location as string) || null,
    };
    return datacenter;
  }

  async getAllStorageProvider(): Promise<any[]> {
    // const res = [];

    const queryBuilder =
      await this.serviceItemTypesTreeService.getQueryBuilder();
    const res = await queryBuilder
      .select('code')
      .where(
        `DatacenterName IS NULL AND CodeHierarchy LIKE  :diskCode 
  AND  LEVEL != :level`,
        { level: 1, diskCode: `%${VdcGenerationItemCodes.Disk}%` },
      )
      .distinct(true)
      .getRawMany<{ code: string }>();
    //
    // const ress = await this.serviceItemTypesTreeService.find({
    //   where: {
    //     datacenterName: IsNull(),
    //     codeHierarchy: Like(`%disk%`),
    //     level: MoreThan(1),
    //   },
    //   select: { code: true },
    // });
    // const authToken = await this.sessionsService.checkAdminSession();
    // const vdcData =
    //   await this.vdcWrapperService.vcloudQuery<AdminOrgVdcStorageProfileQuery>(
    //     authToken,
    //     {
    //       type: 'adminOrgVdcStorageProfile',
    //       format: 'records',
    //       page: 1,
    //       pageSize: 128,
    //       filterEncoded: true,
    //       links: true,
    //       // filter: `vdc==${props['vdcId']}`,
    //     },
    //   );
    //
    // vdcData.data.record = distinctByProperty(vdcData.data.record, 'name');
    // for (const disk of vdcData.data.record) {
    //   const code = GetCodeDisk(disk.name);
    //
    //   res.push({ code: code });
    // }
    // return res;
    return res;
  }
}
