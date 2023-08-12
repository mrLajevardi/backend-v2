import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMapping } from 'src/infrastructure/database/entities/RoleMapping';
import { CreateRoleMappingDto } from './dto/create-role-mapping.dto';
import { UpdateRoleMappingDto } from './dto/update-role-mapping.dto';
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
export class RoleMappingTableService {
  constructor(
    @InjectRepository(RoleMapping)
    private readonly repository: Repository<RoleMapping>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<RoleMapping> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<RoleMapping>): Promise<RoleMapping[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<RoleMapping>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<RoleMapping>): Promise<RoleMapping> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateRoleMappingDto): Promise<RoleMapping> {
    const newItem = plainToClass(RoleMapping, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateRoleMappingDto): Promise<RoleMapping> {
    const item = await this.findById(id);
    const updateItem: Partial<RoleMapping> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<RoleMapping>,
    dto: UpdateRoleMappingDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<RoleMapping> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
