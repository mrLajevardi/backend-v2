import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { DatacenterConfigGenItemsResultDto } from '../../datacenter/dto/datacenter-config-gen-items.result.dto';

@Injectable()
// implements IDatacenterTableService, BaseService
export class DataCenterTableService {
  constructor(
    @InjectRepository(ItemTypesConfig)
    private readonly repository: Repository<ItemTypesConfig>,
  ) {}

  async findBy(
    generationId: string,
    serviceTypeId: string,
  ): Promise<ItemTypesConfig[]> {
    // const itemTypesConfigs = await this.repository.queryRunner.connection.query<
    //   DatacenterConfigGenItemsResultDto[]
    // >('EXEC TREE_TEST');
    const models: DatacenterConfigGenItemsResultDto[] = [];

    return await this.repository.find();
  }
}
