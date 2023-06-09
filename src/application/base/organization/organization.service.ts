import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/infrastructure/database/entities/Organization';
import { CreateOrganizationDto } from 'src/application/base/organization/dto/create-organization.dto';
import { UpdateOrganizationDto } from 'src/application/base/organization/dto/update-organization.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Organization> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Organization[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items 
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }
  
  // Find one item
  async findOne(options?: FindOneOptions): Promise<Organization> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateOrganizationDto) {
    const newItem = plainToClass(Organization, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateOrganizationDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Organization> = Object.assign(item, dto);
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
