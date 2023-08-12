import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionGroups } from 'src/infrastructure/database/entities/PermissionGroups';
import { CreatePermissionGroupsDto } from './dto/create-permission-groups.dto';
import { UpdatePermissionGroupsDto } from './dto/update-permission-groups.dto';
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
export class PermissionGroupsTableService {
  constructor(
    @InjectRepository(PermissionGroups)
    private readonly repository: Repository<PermissionGroups>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<PermissionGroups> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<PermissionGroups>,
  ): Promise<PermissionGroups[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<PermissionGroups>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<PermissionGroups>,
  ): Promise<PermissionGroups> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreatePermissionGroupsDto): Promise<PermissionGroups> {
    const newItem = plainToClass(PermissionGroups, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(
    id: number,
    dto: UpdatePermissionGroupsDto,
  ): Promise<PermissionGroups> {
    const item = await this.findById(id);
    const updateItem: Partial<PermissionGroups> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<PermissionGroups>,
    dto: UpdatePermissionGroupsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<PermissionGroups>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
