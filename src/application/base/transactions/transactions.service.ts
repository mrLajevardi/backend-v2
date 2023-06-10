import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { CreateTransactionDto } from 'src/application/base/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from 'src/application/base/transactions/dto/update-transaction.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly repository: Repository<Transactions>,
  ) {}

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
  async create(dto: CreateTransactionDto) {
    const newItem = plainToClass(Transactions, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Moved from createService 
  async createTransaction(value : string , invoiceId : number, description : string , userId : string ) {
    let dto : CreateTransactionDto; 
    dto.userId = userId; 
    dto.dateTime = new Date(); 
    dto.value = invoiceId; 
    dto.description = description; 
    await this.create(dto);
  }


  // Update an Item using updateDTO
  async update(id: string, dto: UpdateTransactionDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Transactions> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // delete an Item
  async delete(id: string) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }
}
