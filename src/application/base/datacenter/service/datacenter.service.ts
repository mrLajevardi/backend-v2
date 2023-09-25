import { BaseService } from '../../../../infrastructure/service/BaseService';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import { FindManyOptions } from 'typeorm';
// import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { DatacenterFactoryService } from './datacenter.factory.service';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { SessionsService } from '../../sessions/sessions.service';
import { Value } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs.dto';
import { GetProviderVdcsMetadataDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import {
  BaseDatacenterService,
  FoundDatacenterMetadata,
} from '../interface/datacenter.interface';
import { trim } from 'lodash';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';

@Injectable()
export class DatacenterService implements BaseDatacenterService, BaseService {
  constructor(
    private readonly dataCenterTableService: DataCenterTableService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly sessionsService: SessionsService,
    private readonly datacenterServiceFactory: DatacenterFactoryService,
  ) {}

  public findTargetMetadata(
    metadata: GetProviderVdcsMetadataDto,
  ): FoundDatacenterMetadata {
    const targetMetadata: FoundDatacenterMetadata = {
      datacenter: null,
      generation: null,
      datacenterTitle: null,
    };
    for (const value of metadata.metadataEntry) {
      const key = value.key;
      const metadataValue =
        value.typedValue._type === 'MetadataStringValue'
          ? trim(value.typedValue.value.toString()).toLowerCase()
          : value.typedValue.value;
      if (value.key === 'enabled' && !value.typedValue.value) {
        return {
          datacenter: null,
          generation: null,
          datacenterTitle: null,
        };
      }
      switch (key) {
        case 'generation':
          targetMetadata.generation = metadataValue;
          break;
        case 'datacenter':
          targetMetadata.datacenter = metadataValue;
          break;
        case 'datacenterTitle':
          targetMetadata.datacenterTitle = metadataValue;
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
    const { values } = providerVdcsList;
    const providerVdcsFilteredData: Pick<Value, 'id'>[] = values.map(
      (value) => {
        const { id, isEnabled } = value;
        if (isEnabled) {
          return { id };
        }
      },
    );
    const datacenterConfigs: DatacenterConfigGenResultDto[] = [];
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
    return datacenterConfigs;
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
