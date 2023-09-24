import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
// import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { IDatacenterTableService } from './IDatacenter-table.service';
import { BaseService } from '../../../../infrastructure/service/BaseService';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';

@Injectable()
// implements IDatacenterTableService, BaseService
export class DataCenterTableService
  implements IDatacenterTableService, BaseService
{
  constructor(
    @InjectRepository(ItemTypes)
    private readonly repository: Repository<ItemTypes>,
  ) {}

  async find(option: FindManyOptions<ItemTypes>): Promise<ItemTypes[]> {
    const res: ItemTypes[] = await this.repository.find(option);
    return Promise.resolve(res);
  }

  async findOne(option: FindOneOptions<ItemTypes>): Promise<ItemTypes> {
    const res: ItemTypes = await this.repository.findOne(option);
    return Promise.resolve(res);
  }
}
