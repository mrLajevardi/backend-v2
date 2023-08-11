import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceDiscounts } from 'src/infrastructure/database/entities/InvoiceDiscounts';
import { CreateInvoiceDiscountsDto } from './dto/create-invoice-discounts.dto';
import { UpdateInvoiceDiscountsDto } from './dto/update-invoice-discounts.dto';
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
export class InvoiceDiscountsTableService {
  constructor(
    @InjectRepository(InvoiceDiscounts)
    private readonly repository: Repository<InvoiceDiscounts>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<InvoiceDiscounts> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<InvoiceDiscounts>): Promise<InvoiceDiscounts[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindOneOptions<>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<InvoiceDiscounts>): Promise<InvoiceDiscounts> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoiceDiscountsDto): Promise<InvoiceDiscounts> {
    const newItem = plainToClass(InvoiceDiscounts, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(
    id: number,
    dto: UpdateInvoiceDiscountsDto,
  ): Promise<InvoiceDiscounts> {
    const item = await this.findById(id);
    const updateItem: Partial<InvoiceDiscounts> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<InvoiceDiscounts>,
    dto: UpdateInvoiceDiscountsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<InvoiceDiscounts>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
