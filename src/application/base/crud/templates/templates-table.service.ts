import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Templates } from 'src/infrastructure/database/entities/Templates';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateTemplatesDto } from './dto/create-template.dto';
import { plainToClass } from 'class-transformer';
import { UpdateTemplatesDto } from './dto/update-templates.dto';

@Injectable()
export class TemplatesTableService {
  constructor(
    @InjectRepository(Templates)
    private readonly repository: Repository<Templates>,
  ) {}

  // Find One Item by its ID
  async findById(guid: string): Promise<Templates> {
    const template = await this.repository.findOne({ where: { guid } });
    return template;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<Templates>): Promise<Templates[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<Templates>): Promise<Templates> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateTemplatesDto): Promise<Templates> {
    const newItem = plainToClass(CreateTemplatesDto, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(guid: string, dto: UpdateTemplatesDto): Promise<Templates> {
    const item = await this.findById(guid);
    const updateItem: Partial<Templates> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Templates>,
    dto: UpdateTemplatesDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<Templates> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
