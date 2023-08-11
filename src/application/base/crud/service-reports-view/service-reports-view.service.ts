import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceReports } from 'src/infrastructure/database/entities/views/service-reports';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

// This is a view
@Injectable()
export class ServiceReportsViewService {
  constructor(
    @InjectRepository(ServiceReports)
    private readonly repository: Repository<ServiceReports>,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<ServiceReports> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<ServiceReports>): Promise<ServiceReports[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindOneOptions<ServiceReports>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<ServiceReports>): Promise<ServiceReports> {
    const result = await this.repository.findOne(options);
    return result;
  }
}
