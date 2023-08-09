import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { CreateInvoicesDto } from './dto/create-invoices.dto';
import { UpdateInvoicesDto } from './dto/update-invoices.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InvoicesTableService {
  constructor(
    @InjectRepository(Invoices)
    private readonly repository: Repository<Invoices>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Invoices> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Invoices[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Invoices> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoicesDto): Promise<Invoices> {
    const newItem = plainToClass(Invoices, dto);
    const createdItem = this.repository.create(newItem);
    const item = await this.repository.save(createdItem);
    return item;
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInvoicesDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Invoices> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(where: FindOptionsWhere<Invoices>, dto: UpdateInvoicesDto) {
    await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where: FindOptionsWhere<Invoices>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
