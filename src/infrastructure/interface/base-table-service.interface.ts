import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../entity/base.entity';

export interface IBaseTableService<T extends BaseEntity, C, U> {
  readonly repository: Repository<T>;
  findById(guid: string): Promise<T>;

  find(options?: FindManyOptions<T>): Promise<T[]>;

  count(options?: FindManyOptions<T>): Promise<number>;

  create(dto: C): Promise<T>;

  updateAll(where: FindOptionsWhere<T>, dto: U): Promise<UpdateResult>;

  update(id: string, dto: U): Promise<T>;

  delete(id: number): Promise<DeleteResult>;

  deleteAll(where: FindOptionsWhere<T>): Promise<DeleteResult>;

  findOne(options?: FindOneOptions<T>): Promise<T>;
}
