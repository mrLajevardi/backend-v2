import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/database/entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
  SaveOptions,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserTableService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<User> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<User>): Promise<User[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find Items using search criteria
  async findAndCount(
    options?: FindManyOptions<User>,
  ): Promise<[User[], number]> {
    const result = await this.repository.findAndCount(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<User>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<User>): Promise<User> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateUserDto): Promise<User> {
    const newItem = plainToClass(User, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const item = await this.findById(id);
    const updateItem: Partial<User> = Object.assign(item, dto);

    return await this.repository.save(updateItem);
  }

  async updateWithOptions(
    dto: UpdateUserDto,
    saveOption: SaveOptions,
    option: FindOneOptions<User>,
  ): Promise<User> {
    const item = await this.findOne(option);
    const updateItem: Partial<User> = Object.assign(item, dto);

    return await this.repository.save(updateItem, saveOption);
  }
  // update many items
  async updateAll(
    where: FindOptionsWhere<User>,
    dto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where: FindOptionsWhere<User> = {}): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
