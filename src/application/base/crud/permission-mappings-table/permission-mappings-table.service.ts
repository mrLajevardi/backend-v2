import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionMappings } from 'src/infrastructure/database/entities/PermissionMappings';
import { CreatePermissionMappingsDto } from './dto/create-permission-mappings.dto';
import { UpdatePermissionMappingsDto } from './dto/update-permission-mappings.dto';
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
export class PermissionMappingsTableService {
  constructor(
    @InjectRepository(PermissionMappings)
    private readonly repository: Repository<PermissionMappings>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<PermissionMappings> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<PermissionMappings>,
  ): Promise<PermissionMappings[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<PermissionMappings>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<PermissionMappings>,
  ): Promise<PermissionMappings> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreatePermissionMappingsDto): Promise<PermissionMappings> {
    const newItem = plainToClass(PermissionMappings, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(
    id: number,
    dto: UpdatePermissionMappingsDto,
  ): Promise<PermissionMappings> {
    const item = await this.findById(id);
    const updateItem: Partial<PermissionMappings> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<PermissionMappings>,
    dto: UpdatePermissionMappingsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<PermissionMappings>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
