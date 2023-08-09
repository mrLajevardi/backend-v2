import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InfoLog } from 'src/infrastructure/database/entities/InfoLog';
import { CreateInfoLogDto } from './dto/create-info-log.dto';
import { UpdateInfoLogDto } from './dto/update-info-log.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InfoLogTableService {
  constructor(
    @InjectRepository(InfoLog)
    private readonly repository: Repository<InfoLog>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<InfoLog> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<InfoLog[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<InfoLog> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInfoLogDto) {
    const newItem = plainToClass(InfoLog, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInfoLogDto) {
    const item = await this.findById(id);
    const updateItem: Partial<InfoLog> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(where: FindOptionsWhere<InfoLog>, dto: UpdateInfoLogDto) {
    await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where: FindOptionsWhere<InfoLog>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
