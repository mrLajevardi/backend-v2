import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sysdiagrams } from 'src/infrastructure/database/entities/Sysdiagrams';
import { CreateSysdiagramsDto } from './dto/create-sysdiagrams.dto';
import { UpdateSysdiagramsDto } from './dto/update-sysdiagrams.dto';
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
export class SysdiagramsTableService {
  constructor(
    @InjectRepository(Sysdiagrams)
    private readonly repository: Repository<Sysdiagrams>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Sysdiagrams> {
    const serviceType = await this.repository.findOne({
      where: { diagramId: id },
    });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<Sysdiagrams>): Promise<Sysdiagrams[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<Sysdiagrams>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<Sysdiagrams>): Promise<Sysdiagrams> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateSysdiagramsDto): Promise<Sysdiagrams> {
    const newItem = plainToClass(Sysdiagrams, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateSysdiagramsDto): Promise<Sysdiagrams> {
    const item = await this.findById(id);
    const updateItem: Partial<Sysdiagrams> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Sysdiagrams>,
    dto: UpdateSysdiagramsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<Sysdiagrams> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
