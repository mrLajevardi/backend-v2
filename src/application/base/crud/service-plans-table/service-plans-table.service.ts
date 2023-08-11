import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicePlans } from 'src/infrastructure/database/entities/InvoicePlans';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ServicePlans } from 'src/infrastructure/database/entities/ServicePlans';
import { CreateServicePlansDto } from './dto/create-service-plans.dto';
import { UpdateServicePlansDto } from './dto/update-service-plans.dto';

@Injectable()
export class ServicePlansTableService {
  constructor(
    @InjectRepository(ServicePlans)
    private readonly repository: Repository<ServicePlans>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<ServicePlans> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<ServicePlans>): Promise<ServicePlans[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindOneOptions<ServicePlans>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<ServicePlans>): Promise<ServicePlans> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServicePlansDto): Promise<ServicePlans> {
    const newItem = plainToClass(InvoicePlans, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateServicePlansDto): Promise<ServicePlans> {
    const item = await this.findById(id);
    const updateItem: Partial<InvoicePlans> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<InvoicePlans>,
    dto: UpdateServicePlansDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<ServicePlans>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
