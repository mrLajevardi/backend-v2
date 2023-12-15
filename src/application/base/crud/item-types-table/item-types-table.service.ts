import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { CreateItemTypesDto } from './dto/create-item-types.dto';
import { UpdateItemTypesDto } from './dto/update-item-types.dto';
import {
  FindManyOptions,
  FindOneOptions, /// entity -> tableService -> service -> controller
  Repository,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
  QueryRunner,
  DataSource,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ItemTypesTableService {
  constructor(
    @InjectRepository(ItemTypes)
    private readonly repository: Repository<ItemTypes>,
    private readonly datasource: DataSource,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<ItemTypes> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<ItemTypes>): Promise<ItemTypes[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<ItemTypes>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<ItemTypes>): Promise<ItemTypes> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateItemTypesDto): Promise<ItemTypes> {
    const newItem = plainToClass(ItemTypes, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateItemTypesDto): Promise<ItemTypes> {
    const item = await this.findById(id);
    const updateItem: Partial<ItemTypes> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<ItemTypes>,
    dto: UpdateItemTypesDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<ItemTypes> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }

  async getQueryRunner(): Promise<QueryRunner> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
  }

  async createWithQueryRunner(
    queryRunner: QueryRunner,
    dto: CreateItemTypesDto,
  ): Promise<ItemTypes> {
    const newItem = plainToClass(ItemTypes, dto);
    const createdItem = queryRunner.manager.create(ItemTypes, newItem);
    return queryRunner.manager.save(createdItem);
  }

  updateWithQueryRunner(
    queryRunner: QueryRunner,
    where: FindOptionsWhere<ItemTypes>,
    dto: UpdateItemTypesDto,
  ): Promise<UpdateResult> {
    return queryRunner.manager.update(ItemTypes, where, dto);
  }
}
