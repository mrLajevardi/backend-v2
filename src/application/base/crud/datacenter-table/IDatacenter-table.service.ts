import { IBaseService } from '../../../../infrastructure/service/IBaseService';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';

export interface IDatacenterTableService extends IBaseService {
  findOne(option: FindOneOptions<ItemTypes>): Promise<ItemTypes>;
  find(option: FindManyOptions<ItemTypes>): Promise<ItemTypes[]>;
}
