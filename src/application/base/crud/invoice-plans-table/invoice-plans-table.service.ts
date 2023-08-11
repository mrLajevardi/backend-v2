import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicePlans } from 'src/infrastructure/database/entities/InvoicePlans';
import { CreateInvoicePlansDto } from './dto/create-invoice-plans.dto';
import { UpdateInvoicePlansDto } from './dto/update-invoice-plans.dto';
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
export class InvoicePlansTableService {
  constructor(
    @InjectRepository(InvoicePlans)
    private readonly repository: Repository<InvoicePlans>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<InvoicePlans> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<InvoicePlans>): Promise<InvoicePlans[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindOneOptions<InvoicePlans>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<InvoicePlans>): Promise<InvoicePlans> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoicePlansDto): Promise<InvoicePlans> {
    const newItem = plainToClass(InvoicePlans, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInvoicePlansDto): Promise<InvoicePlans> {
    const item = await this.findById(id);
    const updateItem: Partial<InvoicePlans> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<InvoicePlans>,
    dto: UpdateInvoicePlansDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<InvoicePlans>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
