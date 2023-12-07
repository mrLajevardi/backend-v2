import { BaseService } from '../../../../infrastructure/service/BaseService';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import { FindManyOptions, Like } from 'typeorm';
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
import { forEach, trim } from 'lodash';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';
import { MetaDataDatacenterEnum } from '../enum/meta-data-datacenter-enum';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { DataCenterList } from '../dto/datacenter-list.dto';
import {
  DatacenterDetails,
  DiskList,
  GenDto,
  PeriodList,
} from '../dto/datacenter-details.dto';
import { CreateDatacenterDto } from '../dto/create-datacenter.dto';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { DatacenterAdminService } from './datacenter.admin.service';
import { DatacenterOperationTypeEnum } from '../enum/datacenter-opertation-type.enum';
import { InvoiceFactoryService } from '../../invoice/service/invoice-factory.service';
import { InvoiceItemsDto } from '../../invoice/dto/create-service-invoice.dto';

@Injectable()
export class DatacenterService implements BaseDatacenterService, BaseService {
  constructor(
    private readonly dataCenterTableService: DataCenterTableService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly sessionsService: SessionsService,
    private readonly datacenterServiceFactory: DatacenterFactoryService,
    private readonly serviceTypesTableService: ServiceTypesTableService,
    private readonly datacenterAdminService: DatacenterAdminService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly itemTypeTableService: ItemTypesTableService,
  ) {}

  async getDatacenterMetadata(
    datacenterName: string,
    genId: string,
  ): Promise<FoundDatacenterMetadata> {
    const adminToken: string = await this.sessionsService.checkAdminSession();
    const metadata = await this.adminVdcWrapperService.getProviderVdcMetadata(
      adminToken,
      genId,
    );
    const res: FoundDatacenterMetadata = this.findTargetMetadata(metadata);
    return res;
  }

  public findTargetMetadata(
    metadata: GetProviderVdcsMetadataDto,
  ): FoundDatacenterMetadata {
    const targetMetadata: FoundDatacenterMetadata = {
      datacenter: null,
      generation: null,
      datacenterTitle: null,
      cpuSpeed: null,
    };

    for (const value of metadata.metadataEntry) {
      const key = value.key;

      const metadataValue =
        value.typedValue._type === 'MetadataStringValue'
          ? trim(value.typedValue.value.toString()).toLowerCase()
          : value.typedValue.value;
      if (
        value.key === MetaDataDatacenterEnum.Enabled &&
        !value.typedValue.value
      ) {
        console.log('conjdition is run');
        return {
          datacenter: null,
          generation: null,
          datacenterTitle: null,
          cpuSpeed: null,
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
      }
    }
    return targetMetadata;
  }

  public findAllTargetMetadata(
    metadata: GetProviderVdcsMetadataDto,
  ): FoundDatacenterMetadata {
    const targetMetadata: FoundDatacenterMetadata = {
      datacenter: null,
      generation: null,
      datacenterTitle: null,
      cpuSpeed: null,
      enabled: null,
      location: null,
    };

    for (const value of metadata.metadataEntry) {
      const key = value.key;

      const metadataValue =
        value.typedValue._type === 'MetadataStringValue'
          ? trim(value.typedValue.value.toString()).toLowerCase()
          : value.typedValue.value;

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

  public async getDatacenterConfigWithGen(): Promise<
    DatacenterConfigGenResultDto[]
  > {
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
    );

    // console.log("datacenterConfigs:  ",datacenterConfigs)

    return datacenterConfigs;
  }

  private getModelAllProviders(providerVdcsList: GetProviderVdcsDto) {
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

  private getAllProviders(providerVdcsList: GetProviderVdcsDto) {
    const providerIdList = [];

    const { values } = providerVdcsList;
    const providerVdcsFilteredData: Pick<Value, 'id'>[] = values.map(
      (value) => {
        const { id } = value;
        return { id };
      },
    );
    return providerVdcsFilteredData;
  }

  private async configProvider(
    providerVdcsFilteredData: Pick<Value, 'id'>[],
    adminSession: string,
    datacenterConfigs: DatacenterConfigGenResultDto[],
  ) {
    for (const providerVdc of providerVdcsFilteredData) {
      const metadata = await this.adminVdcWrapperService.getProviderVdcMetadata(
        adminSession,
        providerVdc.id,
      );

      // console.log("metadata:  ",metadata);

      const targetMetadata = this.findTargetMetadata(metadata);
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
      };
      if (!targetConfig) {
        const config: DatacenterConfigGenResultDto = {
          datacenter: targetMetadata.datacenter,
          title: targetMetadata.datacenterTitle,
          gens: [newGen],
        };

        // console.log("config:  ",config);

        datacenterConfigs.push(config);
      } else {
        targetConfig.gens.push(newGen);
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

  async getAllDataCenters(): Promise<DataCenterList[]> {
    const adminSession = await this.sessionsService.checkAdminSession();
    const params = {
      page: 1,
      pageSize: 10,
    };

    const providerVdcsList = await this.adminVdcWrapperService.getProviderVdcs(
      adminSession,
      params,
    );

    const providerVdcsFilteredData = this.getAllProviders(providerVdcsList);

    const dataCenterList: DataCenterList[] = [];

    let index = 0;
    for (const providerVdc of providerVdcsFilteredData) {
      index = index + 1;
      const metadata = await this.adminVdcWrapperService.getProviderVdcMetadata(
        adminSession,
        providerVdc.id,
      );
      const targetMetadata = this.findAllTargetMetadata(metadata);
      if (targetMetadata.datacenter === null) {
        index = index - 1;
        continue;
      }

      const targetConfig = dataCenterList.find((value) => {
        return value.datacenter === targetMetadata.datacenter;
      });
      const newGen = {
        name: targetMetadata.generation as string,
        id: providerVdc.id,
        enabled: targetMetadata.enabled,
        cpuSpeed: targetMetadata.cpuSpeed,
      };
      const enabled = await this.GetDatacenterConfigWithGenItems({
        DataCenterId: providerVdc.id,
        GenId: '',
        ServiceTypeId: '',
      });
      if (!targetConfig) {
        const config: DataCenterList = {
          datacenter: targetMetadata.datacenter,
          datacenterTitle: targetMetadata.datacenterTitle,
          gens: [newGen],
          enabled: enabled[0].enabled,
          location: targetMetadata.location,
          number: index,
        };

        dataCenterList.push(config);
      } else {
        targetConfig.gens.push(newGen);
      }
    }
    return Promise.resolve(dataCenterList);
  }

  async getDatacenterDetails(
    datacenterName: string,
  ): Promise<DatacenterDetails> {
    const result = await this.GetDatacenterConfigWithGenItems(
      new DatacenterConfigGenItemsQueryDto(datacenterName, '', ''),
    );

    const disks = result[1].subItems[0].subItems[1].subItems;
    const diskList: DiskList[] = [];

    for (let i = 0; i < disks.length; i++) {
      const res = {
        itemTypeName: disks[i].itemTypeName,
        enabled: disks[i].enabled,
      };
      diskList.push(res);
    }

    const periods = result[3].subItems;

    const periodList: PeriodList[] = [];

    for (let i = 0; i < periods.length; i++) {
      const res = {
        itemTypeName: periods[i].itemTypeName,
        price: periods[i].price,
        unit: periods[i].unit,
        enabled: periods[i].enabled,
      };
      periodList.push(res);
    }

    const datacenterInf = [];

    const allDatacenters = await this.getAllDataCenters();

    for (let i = 0; i < allDatacenters.length; i++) {
      if (allDatacenters[i].datacenter === datacenterName) {
        const gen: GenDto[] = [];
        for (let j = 0; j < allDatacenters[i].gens.length; j++) {
          const res = {
            name: allDatacenters[i].gens[i].name,
            enabled: allDatacenters[i].gens[i].enabled,
            cpuSpeed: allDatacenters[i].gens[i].cpuSpeed,
          };
          gen.push(res);
        }
        datacenterInf.push(gen);
        datacenterInf.push(allDatacenters[i].location);
      }
    }

    const providersGen = [];

    for (let i = 0; i < datacenterInf[0].length; i++) {
      const res = {
        genName: datacenterInf[0][i].name,
        genCpuSpeed: datacenterInf[0][i].cpuSpeed,
      };
      providersGen.push(res);
    }

    const datacenterDetails: any = {
      name: datacenterName,
      diskList,
      periodList,
      enabled: result[0].enabled,
      location: datacenterInf[1],
      gens: datacenterInf[0],
      providers: `${datacenterName}-(${providersGen[0].genName}-${
        providersGen[0].genCpuSpeed / 1000
      }/${providersGen[1].genName}-${providersGen[1].genCpuSpeed / 1000})`,
    };

    return Promise.resolve(datacenterDetails);
  }

  async createDatacenter(dto: CreateDatacenterDto): Promise<void> {
    await this.updateDatacenterMetadata(dto);
    const datacenter = await this.getDatacenterMetadata(
      '',
      dto.generations[0].providerId,
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
    await this.datacenterAdminService.createOrUpdatePeriodItems(
      dto,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateCpuReservationItem(
      dto,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateRamReservationItem(
      dto,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateGenerationItems(
      dto,
      serviceType,
      datacenterName,
      datacenter,
      queryRunner,
    );
    await this.updateDatacenterMetadata(dto);
    await queryRunner.commitTransaction();
    await queryRunner.release();
  }

  async updateDatacenterMetadata(dto: CreateDatacenterDto): Promise<void> {
    for (const provider of dto.generations) {
      const adminSession = await this.sessionsService.checkAdminSession();
      const providerList =
        await this.adminVdcWrapperService.getProviderVdcMetadata(
          adminSession,
          provider.providerId,
        );
      for (const providerItem of providerList.metadataEntry) {
        if (providerItem.key === MetaDataDatacenterEnum.Location) {
          providerItem.typedValue.value = dto.location;
        } else if (
          providerItem.key === MetaDataDatacenterEnum.DatacenterTitle
        ) {
          providerItem.typedValue.value = dto.title;
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
    const serviceType = await this.serviceTypesTableService.findById(dto.id);
    await this.updateDatacenterMetadata(dto);
    const datacenter = await this.getDatacenterMetadata(
      '',
      dto.generations[0].providerId,
    );
    const datacenterName = datacenter.datacenter as string;
    const queryRunner = await this.itemTypeTableService.getQueryRunner();
    await queryRunner.startTransaction();
    await this.itemTypeTableService.updateWithQueryRunner(
      queryRunner,
      {
        datacenterName: Like(`${datacenterName}%`),
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
      dto,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateRamReservationItem(
      dto,
      serviceType,
      datacenterName,
      queryRunner,
    );
    await this.datacenterAdminService.createOrUpdateGenerationItems(
      dto,
      serviceType,
      datacenterName,
      datacenter,
      queryRunner,
    );
    await queryRunner.commitTransaction();
    await queryRunner.release();
  }

  async getDatacenterConfigs(query: { datacenter: null }) {
    const itemTypes = await this.dataCenterTableService.find({
      where: {
        datacenterName: query.datacenter,
      },
    });
    const transformedItems = itemTypes.map((item) => {
      const itemType: InvoiceItemsDto = {
        itemTypeId: item.id,
        value: '',
      };
      return itemType;
    });
    const groupItems = await this.invoiceFactoryService.groupVdcItems(
      transformedItems,
    );
    return groupItems;
  }
}
