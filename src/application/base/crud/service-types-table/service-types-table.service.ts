import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import { CreateServiceTypesDto } from './dto/create-service-types.dto';
import { UpdateServiceTypesDto } from './dto/update-service-types.dto';
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
export class ServiceTypesTableService {
  constructor(
    @InjectRepository(ServiceTypes)
    private readonly repository: Repository<ServiceTypes>,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<ServiceTypes> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<ServiceTypes>): Promise<ServiceTypes[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<ServiceTypes>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<ServiceTypes>): Promise<ServiceTypes> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServiceTypesDto): Promise<ServiceTypes> {
    const newItem = plainToClass(ServiceTypes, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: string, dto: UpdateServiceTypesDto): Promise<ServiceTypes> {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceTypes> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<ServiceTypes>,
    dto: UpdateServiceTypesDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<ServiceTypes>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
