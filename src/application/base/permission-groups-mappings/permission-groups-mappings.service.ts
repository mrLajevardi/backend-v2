import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionGroupsMappings } from 'src/infrastructure/database/entities/PermissionGroupsMappings';
import { CreatePermissionGroupsMappingsDto } from 'src/application/base/permission-groups-mappings/dto/create-permission-groups-mappings.dto';
import { UpdatePermissionGroupsMappingsDto } from 'src/application/base/permission-groups-mappings/dto/update-permission-groups-mappings.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionGroupsMappingsService {
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
  async find(options?: FindManyOptions): Promise<PermissionGroupsMappings[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<PermissionGroupsMappings> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreatePermissionGroupsMappingsDto) {
    const newItem = plainToClass(PermissionGroupsMappings, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdatePermissionGroupsMappingsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<PermissionGroupsMappings> = Object.assign(
      item,
      dto,
    );
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
