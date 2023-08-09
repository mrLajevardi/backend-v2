import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorLog } from 'src/infrastructure/database/entities/ErrorLog';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { UpdateErrorLogDto } from './dto/update-error-log.dto';
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
export class ErrorLogTableService {
  constructor(
    @InjectRepository(ErrorLog)
    private readonly repository: Repository<ErrorLog>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<ErrorLog> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<ErrorLog[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<ErrorLog> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateErrorLogDto) {
    const newItem = plainToClass(ErrorLog, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateErrorLogDto) {
    const item = await this.findById(id);
    const updateItem: Partial<ErrorLog> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(where: FindOptionsWhere<ErrorLog>, dto: UpdateErrorLogDto): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number) : Promise<DeleteResult>{
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where?: FindOptionsWhere<ErrorLog>) : Promise<DeleteResult>{
    return await this.repository.delete(where);
  }
}
