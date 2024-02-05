import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ServiceItemTypesTreeService {
  constructor(
    @InjectRepository(ServiceItemTypesTree)
    private readonly repository: Repository<ServiceItemTypesTree>,
  ) {}

  async getQueryBuilder(alias = 'ServiceItemTypesTree') {
    return this.repository.createQueryBuilder(alias);
  }

  // Find One Item by its ID
  async findById(id: number): Promise<ServiceItemTypesTree> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<ServiceItemTypesTree>,
  ): Promise<ServiceItemTypesTree[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<ServiceItemTypesTree>,
  ): Promise<ServiceItemTypesTree> {
    const result = await this.repository.findOne(options);
    return result;
  }
}
