import { BaseService } from '../../../../infrastructure/service/BaseService';
import { IDatacenterService } from '../interface/IDatacenter.service';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import { FindManyOptions } from 'typeorm';
import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { DatacenterFactoryService } from './datacenter.factory.service';

@Injectable()
export class DatacenterService implements IDatacenterService, BaseService {
  constructor(
    private readonly dataCenterTableService: DataCenterTableService,
    private readonly datacenterServiceFactory: DatacenterFactoryService,
  ) {}
  GetDatacenterConfigWithGen(): Promise<DatacenterConfigGenResultDto[]> {
    // Temp
    const mocks: DatacenterConfigGenResultDto[] =
      DatacenterConfigGenResultDto.GenerateDatacenterConfigGenResultDtoMock();

    return Promise.resolve(mocks);
  }

  async GetDatacenterConfigWithGenItems(
    query: DatacenterConfigGenItemsQueryDto,
  ): Promise<DatacenterConfigGenItemsResultDto[]> {
    const option: FindManyOptions<ItemTypesConfig> =
      this.datacenterServiceFactory.GetFindOptionBy(query);

    const regexPatternGeneration = /^g\d+$/;

    const configs: ItemTypesConfig[] = await this.dataCenterTableService.find(
      option,
    );

    const models: DatacenterConfigGenItemsResultDto[] =
      this.datacenterServiceFactory.GetDtoModelConfigItemDto(configs);

    let tree: DatacenterConfigGenItemsResultDto[] =
      this.datacenterServiceFactory.CreateItemTypeConfigTree(models, 0);

    tree = this.datacenterServiceFactory.GetDatacenterConfigSearched(
      tree,
      query,
      regexPatternGeneration,
    );
    return Promise.resolve(tree);
  }
}
