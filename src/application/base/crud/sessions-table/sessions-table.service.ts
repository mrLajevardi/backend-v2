import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessions } from 'src/infrastructure/database/entities/Sessions';
import { CreateSessionsDto } from './dto/create-sessions.dto';
import { UpdateSessionsDto } from './dto/update-sessions.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SessionsTableService {
  constructor(
    @InjectRepository(Sessions)
    private readonly repository: Repository<Sessions>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Sessions> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Sessions[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Sessions> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateSessionsDto) {
    const newItem = plainToClass(Sessions, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateSessionsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Sessions> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(where: FindOptionsWhere<Sessions>, dto: UpdateSessionsDto) {
    await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where: FindOptionsWhere<Sessions>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
