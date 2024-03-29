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
  UpdateResult,
  Like,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import { BaseServicePropertiesService } from './interfaces/service-properties.service.interface';

@Injectable()
export class ServicePropertiesTableService
  implements BaseServicePropertiesService
{
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
  async count(options?: FindManyOptions<ServiceProperties>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<ServiceProperties>,
  ): Promise<ServiceProperties> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServicePropertiesDto): Promise<ServiceProperties> {
    const newItem = plainToClass(ServiceProperties, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(
    id: number,
    dto: UpdateServicePropertiesDto,
  ): Promise<ServiceProperties> {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceProperties> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<ServiceProperties>,
    dto: UpdateServicePropertiesDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<ServiceProperties>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }

  async getValueBy(
    serviceInstanceId: string,
    keyName: string,
  ): Promise<string> {
    const serviceProperties = await this.findOne({
      where: {
        serviceInstanceId: serviceInstanceId,
        propertyKey: Like(`${keyName.toLowerCase()}`),
      },
      select: { value: true },
    });

    if (serviceProperties == null) {
      return Promise.resolve('');
    }

    return Promise.resolve(serviceProperties.value);
  }
}
