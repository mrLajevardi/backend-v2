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
  UpdateResult,
  FindOptionsRelations,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import { columnName } from 'typeorm-model-generator/dist/src/NamingStrategy';
import { PickKeysByType } from 'typeorm/common/PickKeysByType';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { PaginationReturnDto } from '../../../../infrastructure/dto/pagination-return.dto';

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

  getQueryBuilder() {
    return this.repository.createQueryBuilder('transactions');
  }

  // Find One Item by its ID
  async findById(id: string): Promise<Transactions> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<Transactions>): Promise<Transactions[]> {
    const result = await this.repository.find(options);
    return result;
  }

  async paginate(
    page: number,
    pageSize: number,
    where?: FindOptionsWhere<Transactions>,
    orderBy?: FindOptionsOrder<Transactions>,
    relations?: FindOptionsRelations<Transactions>,
  ): Promise<PaginationReturnDto<Transactions>> {
    const data = await this.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      order: orderBy,
      relations,
    });

    const totalRecord = await this.count({
      where,
    });

    return {
      page: page,
      pageSize: pageSize,
      record: data,
      total: totalRecord,
    };
  }

  // Count the items
  async count(options?: FindManyOptions<Transactions>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<Transactions>): Promise<Transactions> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateTransactionsDto): Promise<Transactions> {
    const newItem = plainToClass(Transactions, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: string, dto: UpdateTransactionsDto): Promise<Transactions> {
    const item = await this.findById(id);
    const updateItem: Partial<Transactions> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Transactions>,
    dto: UpdateTransactionsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<Transactions>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
