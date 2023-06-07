import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsMapping } from 'src/infrastructure/database/entities/GroupsMapping';
import { CreateGroupsMappingDto } from 'src/application/base/groups-mapping/dto/create-groups-mappings.dto';
import { UpdateGroupsMappingDto } from 'src/application/base/groups-mapping/dto/update-groups-mappings.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GroupsMappingService {
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
  async find(options?: FindManyOptions): Promise<GroupsMapping[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<GroupsMapping> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateGroupsMappingDto) {
    const newItem = plainToClass(GroupsMapping, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateGroupsMappingDto) {
    const item = await this.findById(id);
    const updateItem: Partial<GroupsMapping> = Object.assign(item, dto);
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
