import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiTransactionsLogs } from 'src/infrastructure/database/entities/AiTransactionsLogs';
import { CreateAITransactionsLogsDto } from './dto/create-aitransactions-logs.dto';
import { UpdateAITransactionsLogsDto } from './dto/update-aitransactions-logs.dto';
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
export class AITransactionsLogsTableService {
  constructor(
    @InjectRepository(AiTransactionsLogs)
    private readonly repository: Repository<AiTransactionsLogs>,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<AiTransactionsLogs> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<AiTransactionsLogs>,
  ): Promise<AiTransactionsLogs[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<AiTransactionsLogs>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<AiTransactionsLogs>,
  ): Promise<AiTransactionsLogs> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateAITransactionsLogsDto): Promise<AiTransactionsLogs> {
    const newItem = plainToClass(AiTransactionsLogs, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(
    id: string,
    dto: UpdateAITransactionsLogsDto,
  ): Promise<AiTransactionsLogs> {
    const item = await this.findById(id);
    const updateItem: Partial<AiTransactionsLogs> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<AiTransactionsLogs>,
    dto: UpdateAITransactionsLogsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<AiTransactionsLogs>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
