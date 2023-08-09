import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemSettings } from 'src/infrastructure/database/entities/SystemSettings';
import { CreateSystemSettingsDto } from './dto/create-system-settings.dto';
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SystemSettingsTableService {
  constructor(
    @InjectRepository(SystemSettings)
    private readonly repository: Repository<SystemSettings>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<SystemSettings> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<SystemSettings[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<SystemSettings> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateSystemSettingsDto) {
    const newItem = plainToClass(SystemSettings, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateSystemSettingsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<SystemSettings> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<SystemSettings>,
    dto: UpdateSystemSettingsDto,
  ) {
    await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where: FindOptionsWhere<SystemSettings>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
