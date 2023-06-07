import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { CreateInvoiceDto } from 'src/application/base/invoices/dto/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/application/base/invoices/dto/update-invoice.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InvoiceService {
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

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Invoices> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoiceDto) {
    const newItem = plainToClass(Invoices, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInvoiceDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Invoices> = Object.assign(item, dto);
    await this.repository.save(updateItem);
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
