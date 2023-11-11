import { BaseService } from '../../../../infrastructure/service/BaseService';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import { FindManyOptions } from 'typeorm';
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
import { trim } from 'lodash';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';
import { MetaDataDatacenterEnum } from '../enum/meta-data-datacenter-enum';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { CreateDatacenterDto } from '../dto/create-datacenter.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import {
  ItemTypeCodes,
  ItemTypeUnits,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';

@Injectable()
export class DatacenterService implements BaseDatacenterService, BaseService {
  constructor(
    private readonly dataCenterTableService: DataCenterTableService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly sessionsService: SessionsService,
    private readonly datacenterServiceFactory: DatacenterFactoryService,
    private readonly serviceTypesTableService: ServiceTypesTableService,
    private readonly itemTypesTableService: ItemTypesTableService,
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

    await this.configProvider(
      providerVdcsFilteredData,
      adminSession,
      datacenterConfigs,
    );
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
      const targetMetadata = this.findTargetMetadata(metadata);
      if (targetMetadata.datacenter === null) {
        continue;
      }
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

  async createDatacenter(dto: CreateDatacenterDto): Promise<any> {
    const datacenter = await this.getDatacenterMetadata(
      '',
      dto.generations[0].providerId,
    );
    const datacenterName = 'Asia';
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
    await this.datacenterServiceFactory.createPeriodItems(
      dto,
      serviceType,
      datacenterName,
    );
    await this.datacenterServiceFactory.createCpuReservationItem(
      dto,
      serviceType,
      datacenterName,
    );
    await this.datacenterServiceFactory.createRamReservationItem(
      dto,
      serviceType,
      datacenterName,
    );
    await this.datacenterServiceFactory.createGenerationItems(
      dto,
      serviceType,
      datacenterName,
      datacenter,
    );
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
}
