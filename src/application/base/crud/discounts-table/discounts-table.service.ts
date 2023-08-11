import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discounts } from 'src/infrastructure/database/entities/Discounts';
import { CreateDiscountsDto } from './dto/create-discounts.dto';
import { UpdateDiscountsDto } from './dto/update-discounts.dto';
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
export class DiscountsTableService {
  constructor(
    @InjectRepository(Discounts)
    private readonly repository: Repository<Discounts>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Discounts> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<Discounts>): Promise<Discounts[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<Discounts>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<Discounts>): Promise<Discounts> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateDiscountsDto): Promise<Discounts> {
    const newItem = plainToClass(Discounts, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateDiscountsDto): Promise<Discounts> {
    const item = await this.findById(id);
    const updateItem: Partial<Discounts> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Discounts>,
    dto: UpdateDiscountsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  // delete all items
  async deleteAll( where: FindOptionsWhere<Discounts> = {} ) :  Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
