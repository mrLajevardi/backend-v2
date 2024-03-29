import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configs } from 'src/infrastructure/database/entities/Configs';
import { CreateConfigsDto } from './dto/create-configs.dto';
import { UpdateConfigsDto } from './dto/update-configs.dto';
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
export class ConfigsTableService {
  constructor(
    @InjectRepository(Configs)
    private readonly repository: Repository<Configs>,
  ) {}

  async getVgpuRobotConfigData(): Promise<Configs[]> {
    const propertyKeys = [
      'config.vgpu.orgName',
      'config.vgpu.orgId',
      'config.vgpu.vdcId',
      'QualityPlans.bronze.costPerHour',
      'QualityPlans.silver.costPerHour',
      'QualityPlans.gold.costPerHour',
    ];

    return this.repository
      .createQueryBuilder('configs')
      .where('configs.PropertyKey IN (:...propertyKeys)', { propertyKeys })
      .getMany();
  }

  // Find One Item by its ID
  async findById(id: number): Promise<Configs> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<Configs>): Promise<Configs[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<Configs>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<Configs>): Promise<Configs> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateConfigsDto): Promise<Configs> {
    const newItem = plainToClass(Configs, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateConfigsDto): Promise<Configs> {
    const item = await this.findById(id);
    const updateItem: Partial<Configs> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Configs>,
    dto: UpdateConfigsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<Configs> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
