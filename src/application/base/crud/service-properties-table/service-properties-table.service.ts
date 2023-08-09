import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProperties } from 'src/infrastructure/database/entities/ServiceProperties';
import { CreateServicePropertiesDto } from './dto/create-service-properties.dto';
import { UpdateServicePropertiesDto } from './dto/update-service-properties.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServicePropertiesTableService {
  constructor(
    @InjectRepository(ServiceProperties)
    private readonly repository: Repository<ServiceProperties>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<ServiceProperties> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<ServiceProperties>,
  ): Promise<ServiceProperties[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<ServiceProperties> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServicePropertiesDto) {
    const newItem = plainToClass(ServiceProperties, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateServicePropertiesDto) {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceProperties> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<ServiceProperties>,
    dto: UpdateServicePropertiesDto,
  ) {
    await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where: FindOptionsWhere<ServiceProperties>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
