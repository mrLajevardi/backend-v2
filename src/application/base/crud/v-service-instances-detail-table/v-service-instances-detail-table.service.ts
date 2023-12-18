import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { VServiceInstances } from '../../../../infrastructure/database/entities/views/v-serviceInstances';
import { VServiceInstanceDetail } from '../../../../infrastructure/database/entities/views/v-serviceInstanceDetail';

@Injectable()
export class VServiceInstancesDetailTableService {
  constructor(
    @InjectRepository(VServiceInstanceDetail)
    private readonly repository: Repository<VServiceInstanceDetail>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<VServiceInstanceDetail> {
    return this.repository.createQueryBuilder('V_ServiceDetail');
  }

  // Find One Item by its ID
  // async findById(id: string): Promise<VServiceInstanceDetail> {
  //   const serviceType = await this.repository.findOne({ where: {  } });
  //   return serviceType;
  // }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<VServiceInstanceDetail>,
  ): Promise<VServiceInstanceDetail[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(
    options?: FindManyOptions<VServiceInstanceDetail>,
  ): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<VServiceInstanceDetail>,
  ): Promise<VServiceInstanceDetail> {
    const result = await this.repository.findOne(options);
    return result;
  }
}
