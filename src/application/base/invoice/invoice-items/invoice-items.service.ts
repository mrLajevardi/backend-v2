import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceItems } from 'src/infrastructure/database/entities/InvoiceItems';
import { CreateInvoiceItemsDto } from 'src/application/base/invoice/invoice-items/dto/create-invoice-items.dto';
import { UpdateInvoiceItemsDto } from 'src/application/base/invoice/invoice-items/dto/update-invoice-items.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InvoiceItemsService {
  constructor(
    @InjectRepository(InvoiceItems)
    private readonly repository: Repository<InvoiceItems>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<InvoiceItems> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<InvoiceItems[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<InvoiceItems> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoiceItemsDto) {
    const newItem = plainToClass(InvoiceItems, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Create invoice items
  async createInvoiceItems(invoiceID: number, items, data) {
    for (const item of Object.keys(items)) {
      let dto: CreateInvoiceItemsDto;
      const itemTitle = items[item].Code;
      dto.fee = items[item].Fee;
      dto.invoiceId = invoiceID;
      dto.itemId = items[item].ID;
      dto.quantity = data[itemTitle];
      await this.create(dto);
    }
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInvoiceItemsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<InvoiceItems> = Object.assign(item, dto);
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
