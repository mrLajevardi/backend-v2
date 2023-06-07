import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionGroups } from 'src/infrastructure/database/entities/PermissionGroups';
import { CreatePermissionGroupDto } from 'src/application/base/permission-groups/dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from 'src/application/base/permission-groups/dto/update-permission-group.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionGroupsService {
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
  async find(options?: FindManyOptions): Promise<PermissionGroups[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<PermissionGroups> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreatePermissionGroupDto) {
    const newItem = plainToClass(PermissionGroups, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdatePermissionGroupDto) {
    const item = await this.findById(id);
    const updateItem: Partial<PermissionGroups> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }
}
