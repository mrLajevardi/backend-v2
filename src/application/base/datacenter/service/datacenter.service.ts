import { BaseService } from '../../../../infrastructure/service/BaseService';
import { IDatacenterService } from '../interface/IDatacenter.service';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import { FindManyOptions } from 'typeorm';
import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';

@Injectable()
export class DatacenterService implements IDatacenterService, BaseService {
  constructor(
    private readonly dataCenterTableService: DataCenterTableService,
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
    const models: DatacenterConfigGenItemsResultDto[] = [];

    let option: FindManyOptions<ItemTypesConfig> = {};

    option.where = {};
    option = this.extracted(query, option);

    const res = await this.dataCenterTableService.find(option);

    res.forEach((itemTypeConfig): void => {
      models.push(
        new DatacenterConfigGenItemsResultDto(
          itemTypeConfig.id,
          itemTypeConfig.title,
          itemTypeConfig.serviceType.id,
          itemTypeConfig.price,
          itemTypeConfig.percent,
          itemTypeConfig.min,
          itemTypeConfig.max,
          itemTypeConfig.unit,
          itemTypeConfig.parentId,
        ),
      );
    });

    const fres: DatacenterConfigGenItemsResultDto[] = this.Tree(models, 0);
    // fres.find(w=>w.)
    return Promise.resolve(fres);
  }

  private extracted(
    query: DatacenterConfigGenItemsQueryDto,
    option: FindManyOptions<ItemTypesConfig>,
  ): FindManyOptions<ItemTypesConfig> {
    const option2: FindManyOptions<ItemTypesConfig> = {};
    option.where = {};
    if (
      query.DataCenterId != undefined &&
      query.DataCenterId.trim().length > 0
    ) {
      option.where.datacenterName = query.DataCenterId;
    }
    option.relations = { serviceType: true };
    if (
      !query.ServiceTypeId != undefined &&
      query.ServiceTypeId.trim().length > 0
    ) {
      option.where.serviceType = { id: query.ServiceTypeId };
    }

    return option;
  }

  Tree(
    ItemTypesConfig: DatacenterConfigGenItemsResultDto[],
    parentId: number,
    res: DatacenterConfigGenItemsResultDto[] = [],
  ): DatacenterConfigGenItemsResultDto[] {
    const parents = ItemTypesConfig.filter((d) => d.ParentId == parentId);

    if (parents != null && parents.length > 0) {
      parents.forEach((e: DatacenterConfigGenItemsResultDto): void => {
        const res2: DatacenterConfigGenItemsResultDto[] = this.Tree(
          ItemTypesConfig,
          e.Id,
          e.SubItems,
        );
        if (res2 != null && res2.length > 0) {
          e.SubItems.concat(res2);
        }
        res.push(e);
      });
    }
    return res;
  }
}
