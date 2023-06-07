import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProperties } from 'src/infrastructure/database/entities/ServiceProperties';
import { CreateServicePropertiesDto } from 'src/application/base/service-properties/dto/create-service-properties.dto';
import { UpdateServicePropertiesDto } from 'src/application/base/service-properties/dto/update-service-properties.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServicePropertiesService {
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
  async find(options?: FindManyOptions): Promise<ServiceProperties[]> {
    const result = await this.repository.find(options);
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

  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }
}
