import { IBaseService } from '../../../../infrastructure/service/IBaseService';
import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export interface IDatacenterTableService extends IBaseService {
  findOne(option: FindOneOptions<ItemTypesConfig>): Promise<ItemTypesConfig>;
  find(option: FindManyOptions<ItemTypesConfig>): Promise<ItemTypesConfig[]>;
}
