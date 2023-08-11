import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionGroupsMappings } from 'src/infrastructure/database/entities/PermissionGroupsMappings';
import { CreatePermissionGroupsMappingsDto } from './dto/create-permission-groups-mappings.dto';
import { UpdatePermissionGroupsMappingsDto } from './dto/update-permission-groups-mappings.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionGroupsMappingsTableService {
  constructor(
    @InjectRepository(PermissionGroupsMappings)
    private readonly repository: Repository<PermissionGroupsMappings>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<PermissionGroupsMappings> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<PermissionGroupsMappings>): Promise<PermissionGroupsMappings[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<PermissionGroupsMappings>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<PermissionGroupsMappings>): Promise<PermissionGroupsMappings> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(
    dto: CreatePermissionGroupsMappingsDto,
  ): Promise<PermissionGroupsMappings> {
    const newItem = plainToClass(PermissionGroupsMappings, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(
    id: number,
    dto: UpdatePermissionGroupsMappingsDto,
  ): Promise<PermissionGroupsMappings> {
    const item = await this.findById(id);
    const updateItem: Partial<PermissionGroupsMappings> = Object.assign(
      item,
      dto,
    );
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<PermissionGroupsMappings>,
    dto: UpdatePermissionGroupsMappingsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<PermissionGroupsMappings>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
