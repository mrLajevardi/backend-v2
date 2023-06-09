import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DebugLog } from 'src/infrastructure/database/entities/DebugLog';
import { CreateDebugLogDto } from 'src/application/base/debug-log/dto/create-debug-log.dto';
import { UpdateDebugLogDto } from 'src/application/base/debug-log/dto/update-debug-log.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DebugLogService {
  constructor(
    @InjectRepository(DebugLog)
    private readonly repository: Repository<DebugLog>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<DebugLog> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<DebugLog[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items 
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<DebugLog> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateDebugLogDto) {
    const newItem = plainToClass(DebugLog, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateDebugLogDto) {
    const item = await this.findById(id);
    const updateItem: Partial<DebugLog> = Object.assign(item, dto);
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
