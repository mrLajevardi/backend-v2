import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceItemList } from 'src/infrastructure/database/entities/views/invoice-item-list';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

// This is a view

@Injectable()
export class InvoiceItemListService {
  constructor(
    @InjectRepository(InvoiceItemList)
    private readonly repository: Repository<InvoiceItemList>,
  ) {}

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<InvoiceItemList[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<InvoiceItemList> {
    const result = await this.repository.findOne(options);
    return result;
  }
}
