import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/infrastructure/database/entities/Plans';
import { CreatePlansDto } from './dto/create-plans.dto';
import { UpdatePlansDto } from './dto/update-plans.dto';
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
export class PlansTableService {
  constructor(
    @InjectRepository(Plans)
    private readonly repository: Repository<Plans>,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<Plans> {
    const serviceType = await this.repository.findOne({ where: { code: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Plans[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Plans> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreatePlansDto): Promise<Plans> {
    const newItem = plainToClass(Plans, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: string, dto: UpdatePlansDto): Promise<Plans> {
    const item = await this.findById(id);
    const updateItem: Partial<Plans> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Plans>,
    dto: UpdatePlansDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where?: FindOptionsWhere<Plans>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
