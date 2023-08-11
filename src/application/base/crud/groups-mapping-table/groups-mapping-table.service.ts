import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsMapping } from 'src/infrastructure/database/entities/GroupsMapping';
import { CreateGroupMappingsDto } from './dto/create-group-mappings.dto';
import { UpdateGroupMappingsDto } from './dto/update-group-mappings.dto';
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
export class GroupsMappingTableService {
  constructor(
    @InjectRepository(GroupsMapping)
    private readonly repository: Repository<GroupsMapping>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<GroupsMapping> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<GroupsMapping>): Promise<GroupsMapping[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindOneOptions<GroupsMapping>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<GroupsMapping>): Promise<GroupsMapping> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateGroupMappingsDto): Promise<GroupsMapping> {
    const newItem = plainToClass(GroupsMapping, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(
    id: number,
    dto: UpdateGroupMappingsDto,
  ): Promise<GroupsMapping> {
    const item = await this.findById(id);
    const updateItem: Partial<GroupsMapping> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<GroupsMapping>,
    dto: UpdateGroupMappingsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where?: FindOptionsWhere<GroupsMapping>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
