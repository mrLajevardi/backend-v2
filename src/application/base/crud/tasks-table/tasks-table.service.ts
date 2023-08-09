import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from 'src/infrastructure/database/entities/Tasks';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TasksTableService {
  constructor(
    @InjectRepository(Tasks)
    private readonly repository: Repository<Tasks>,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<Tasks> {
    const serviceType = await this.repository.findOne({
      where: { taskId: id },
    });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Tasks[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Tasks> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateTasksDto): Promise<Tasks> {
    const newItem = plainToClass(Tasks, dto);
    const createdItem = this.repository.create(newItem);
    const task = await this.repository.save(createdItem);
    return task;
  }

  // Update an Item using updateDTO
  async update(id: string, dto: UpdateTasksDto): Promise<Tasks> {
    const item = await this.findById(id);
    const updateItem: Partial<Tasks> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<Tasks>,
    dto: UpdateTasksDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(where?: FindOptionsWhere<Tasks>): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
