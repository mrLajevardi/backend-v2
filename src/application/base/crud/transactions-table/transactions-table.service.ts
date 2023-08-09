import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { CreateTransactionsDto } from './dto/create-transactions.dto';
import { UpdateTransactionsDto } from './dto/update-transactions.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TransactionsTableService {
  constructor(
    @InjectRepository(Transactions)
    private readonly repository: Repository<Transactions>,
  ) {}

  // target transactions for robot  paygservice
  async robotPaygTargetTransactions(): Promise<any[]> {
    return this.repository
      .createQueryBuilder('transactions')
      .select('SUM(transactions.VALUE)', 'Sum')
      .addSelect('MAX(transactions.ID)', 'LastID')
      .addSelect('MAX(transactions.DateTime)', 'EndDate')
      .addSelect('MIN(transactions.DateTime)', 'StartDate')
      .addSelect('transactions.ServiceInstanceID', 'ServiceInstanceID')
      .where('transactions.PaymentType = 2', { paymentType: 2 })
      .andWhere('transactions.InvoiceID IS NULL')
      .groupBy('transactions.ServiceInstanceID')
      .getRawMany();
  }

  // Find One Item by its ID
  async findById(id: string): Promise<Transactions> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Transactions[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Transactions> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateTransactionsDto) {
    const newItem = plainToClass(Transactions, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: string, dto: UpdateTransactionsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Transactions> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Transactions>,
    dto: UpdateTransactionsDto,
  ) {
    await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: string) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where: FindOptionsWhere<Transactions>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
