import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { EntityLog } from '../../../../infrastructure/database/entities/EntityLog';
import { plainToClass } from 'class-transformer';
import { CreateEntityLogDto } from './dto/create-entity-log.dto';
import { UpdateEntityLogDto } from './dto/update-entity-log.dto';

@Injectable()
export class EntityLogTableService {
  constructor(
    @InjectRepository(EntityLog)
    private readonly repository: Repository<EntityLog>,
  ) {}

  async findById(id: number): Promise<EntityLog | null> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async find(options?: FindManyOptions<EntityLog>): Promise<EntityLog[]> {
    return await this.repository.find(options);
  }

  async count(options?: FindManyOptions<EntityLog>): Promise<number> {
    return await this.repository.count(options);
  }

  async create(dto: CreateEntityLogDto): Promise<EntityLog> {
    const newItem = plainToClass(EntityLog, dto);
    const createdItem = this.repository.create(newItem);

    return await this.repository.save(createdItem);
  }

  async updateAll(
    where: FindOptionsWhere<EntityLog>,
    dto: UpdateEntityLogDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  async update(id: number, dto: UpdateEntityLogDto): Promise<EntityLog> {
    const item = await this.findById(id);
    const updateItem: Partial<EntityLog> = Object.assign(item, dto);

    return await this.repository.save(updateItem);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async deleteAll(
    where: FindOptionsWhere<EntityLog> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }

  async findOne(options?: FindOneOptions<EntityLog>): Promise<EntityLog> {
    return await this.repository.findOne(options);
  }
}
