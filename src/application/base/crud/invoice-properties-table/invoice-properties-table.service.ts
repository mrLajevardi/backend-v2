import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceProperties } from 'src/infrastructure/database/entities/InvoiceProperties';
import { CreateInvoicePropertiesDto } from './dto/create-invoice-properties.dto';
import { UpdateInvoicePropertiesDto } from './dto/update-invoice-properties.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InvoicePropertiesTableService {
  constructor(
    @InjectRepository(InvoiceProperties)
    private readonly repository: Repository<InvoiceProperties>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<InvoiceProperties> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<InvoiceProperties[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<InvoiceProperties> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoicePropertiesDto) {
    const newItem = plainToClass(InvoiceProperties, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInvoicePropertiesDto) {
    const item = await this.findById(id);
    const updateItem: Partial<InvoiceProperties> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<InvoiceProperties>,
    dto: UpdateInvoicePropertiesDto,
  ) {
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
