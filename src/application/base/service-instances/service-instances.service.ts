import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { CreateServiceInstancesDto } from 'src/application/base/service-instances/dto/create-service-instances.dto';
import { UpdateServiceInstancesDto } from 'src/application/base/service-instances/dto/update-service-instances.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { DatabaseErrorException } from 'src/infrastructure/exceptions/database-error.exception';

@Injectable()
export class ServiceInstancesService {
  constructor(
    @InjectRepository(ServiceInstances)
    private readonly repository: Repository<ServiceInstances>,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<ServiceInstances> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<ServiceInstances[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Exec Sp_CountAradAIUsedEachService
  async spCountAradAiUsedEachService(instanceId: string): Promise<number> {
    const query =
      "EXEC Sp_CountAradAIUsedEachService @ServiceInstanceID='" +
      instanceId +
      "'";
    try {
      const result = await this.repository.query(query);
      return result;
    } catch (err) {
      throw new DatabaseErrorException('sp_count problem', err);
    }
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<ServiceInstances> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServiceInstancesDto) {
    const newItem = plainToClass(ServiceInstances, dto);
    const createdItem = this.repository.create(newItem);
    const result = await this.repository.save(createdItem);
    return result;
  }

  

  // Update an Item using updateDTO
  async update(id: string, dto: UpdateServiceInstancesDto) {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceInstances> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // delete an Item
  async delete(id: string) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }
}
