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

@Injectable()
export class DatacenterService implements BaseDatacenterService, BaseService {
  constructor(
    private readonly dataCenterTableService: DataCenterTableService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly sessionsService: SessionsService,
    private readonly datacenterServiceFactory: DatacenterFactoryService,
  ) {}

  async getDatacenterMetadata(
    datacenterName: string,
    genId: string,
  ): Promise<FoundDatacenterMetadata> {
    const adminToken: string = await this.sessionsService.checkAdminSession();

    const allDatacenterConfigs = await this.getDatacenterConfigWithGen();

    const filterDatacenter = allDatacenterConfigs.filter(
      (datacenter) => datacenter.title === datacenterName,
    );

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
}
