import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from 'src/infrastructure/database/entities/Tickets';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';
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
export class TicketsTableService {
  constructor(
    @InjectRepository(Tickets)
    private readonly repository: Repository<Tickets>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Tickets> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<Tickets>): Promise<Tickets[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<Tickets>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<Tickets>): Promise<Tickets> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateTicketsDto): Promise<Tickets> {
    const newItem = plainToClass(Tickets, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateTicketsDto): Promise<Tickets> {
    const item = await this.findById(id);
    const updateItem: Partial<Tickets> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Tickets>,
    dto: UpdateTicketsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<Tickets> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
