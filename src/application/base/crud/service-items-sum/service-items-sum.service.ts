import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceItemsSum } from 'src/infrastructure/database/entities/views/service-items-sum';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

// This is a view

@Injectable()
export class ServiceItemsSumService {
  constructor(
    @InjectRepository(ServiceItemsSum)
    private readonly repository: Repository<ServiceItemsSum>,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<ServiceItemsSum> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<ServiceItemsSum>): Promise<ServiceItemsSum[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<ServiceItemsSum>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<ServiceItemsSum>): Promise<ServiceItemsSum> {
    const result = await this.repository.findOne(options);
    return result;
  }
}
