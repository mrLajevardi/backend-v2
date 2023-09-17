import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { DatacenterConfigGenItemsResultDto } from '../../datacenter/dto/datacenter-config-gen-items.result.dto';
import { IDatacenterTableService } from './IDatacenter-table.service';
import { BaseService } from '../../../../infrastructure/service/BaseService';

@Injectable()
// implements IDatacenterTableService, BaseService
export class DataCenterTableService
  implements IDatacenterTableService, BaseService
{
  constructor(
    @InjectRepository(ItemTypesConfig)
    private readonly repository: Repository<ItemTypesConfig>,
  ) {}

  async findBy(
    datacenterName: string,
    generationId: string,
    serviceTypeId: string,
  ): Promise<ItemTypesConfig[]> {
    // const itemTypesConfigs = await this.repository.queryRunner.connection.query<
    //   DatacenterConfigGenItemsResultDto[]
    // >('EXEC TREE_TEST');
    // const models: DatacenterConfigGenItemsResultDto[] = [];

    return await this.repository.find({ where: {} });
  }

  async find(
    option: FindManyOptions<ItemTypesConfig>,
  ): Promise<ItemTypesConfig[]> {
    const res: ItemTypesConfig[] = await this.repository.find(option);
    return Promise.resolve(res);
  }

  async findOne(
    option: FindOneOptions<ItemTypesConfig>,
  ): Promise<ItemTypesConfig> {
    const res: ItemTypesConfig = await this.repository.findOne(option);
    return Promise.resolve(res);
  }
}
