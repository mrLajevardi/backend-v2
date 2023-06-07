import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMapping } from 'src/infrastructure/database/entities/RoleMapping';
import { CreateRoleMappingDto } from 'src/application/base/role-mapping/dto/create-role-mapping.dto';
import { UpdateRoleMappingDto } from 'src/application/base/role-mapping/dto/update-role-mapping.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleMappingService {
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
  async find(options?: FindManyOptions): Promise<RoleMapping[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<RoleMapping> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateRoleMappingDto) {
    const newItem = plainToClass(RoleMapping, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateRoleMappingDto) {
    const item = await this.findById(id);
    const updateItem: Partial<RoleMapping> = Object.assign(item, dto);
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
