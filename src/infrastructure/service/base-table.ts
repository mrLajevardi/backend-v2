import { Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import { BaseEntity } from '../entity/base.entity';
import { IBaseTableService } from '../interface/base-table-service.interface';

type Constructor<I extends BaseEntity> = new (...args: any[]) => I;

export function BaseTableService<T extends BaseEntity, C, U>(
  entity: Constructor<T>,
): Type<IBaseTableService<T, C, U>> {
  class DataServiceHost {
    @InjectRepository(entity) public readonly repository: Repository<T>;

    public async findById(guid: string): Promise<T> {
      const findOptions: FindOneOptions<T> = {
        where: {
          guid: guid,
        } as FindOptionsWhere<T>,
      };
      return this.repository.findOne(findOptions);
    }

    async find(options?: FindManyOptions<T>): Promise<T[]> {
      return await this.repository.find(options);
    }

    async count(options?: FindManyOptions<T>): Promise<number> {
      return await this.repository.count(options);
    }

    async create(dto: C): Promise<T> {
      const newItem = plainToClass(entity, dto);
      const createdItem = this.repository.create(newItem);

      return await this.repository.save(createdItem);
    }

    async updateAll(where: FindOptionsWhere<T>, dto: U): Promise<UpdateResult> {
      return await this.repository.update(where, dto as any);
    }

    async update(id: string, dto: U): Promise<T> {
      const item = await this.findById(id);
      const updateItem: DeepPartial<T> = Object.assign(item, dto);

      return await this.repository.save(updateItem);
    }

    async delete(id: number): Promise<DeleteResult> {
      return await this.repository.delete(id);
    }

    async deleteAll(where: FindOptionsWhere<T> = {}): Promise<DeleteResult> {
      return await this.repository.delete(where);
    }

    async findOne(options?: FindOneOptions<T>): Promise<T> {
      return await this.repository.findOne(options);
    }
  }
  return DataServiceHost;
}
