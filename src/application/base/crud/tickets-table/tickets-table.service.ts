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
  async find(options?: FindManyOptions): Promise<Tickets[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Tickets> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateTicketsDto) {
    const newItem = plainToClass(Tickets, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateTicketsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Tickets> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(where: FindOptionsWhere<Tickets>, dto: UpdateTicketsDto) {
    await this.repository.update(where, dto);
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
