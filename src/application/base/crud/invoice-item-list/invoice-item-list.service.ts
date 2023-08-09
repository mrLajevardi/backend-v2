import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceItemList } from 'src/infrastructure/database/entities/views/invoice-item-list';
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

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

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<InvoiceItemList>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
