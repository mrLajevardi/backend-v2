import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { VServiceInstances } from '../../../../infrastructure/database/entities/views/v-serviceInstances';

@Injectable()
export class VServiceInstancesTableService {
  constructor(
    @InjectRepository(VServiceInstances)
    private readonly repository: Repository<VServiceInstances>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<VServiceInstances> {
    return this.repository.createQueryBuilder('V_ServiceInstances');
  }

  // Find One Item by its ID
  async findById(id: string): Promise<VServiceInstances> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<VServiceInstances>,
  ): Promise<VServiceInstances[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<VServiceInstances>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<VServiceInstances>,
  ): Promise<VServiceInstances> {
    const result = await this.repository.findOne(options);
    return result;
  }
}
