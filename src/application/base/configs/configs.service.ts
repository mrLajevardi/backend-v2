import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configs } from 'src/infrastructure/database/entities/Configs';
import { CreateConfigsDto } from 'src/application/base/configs/dto/create-configs.dto';
import { UpdateConfigsDto } from 'src/application/base/configs/dto/update-configs.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectRepository(Configs)
    private readonly repository: Repository<Configs>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Configs> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Configs[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items 
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Configs> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateConfigsDto) {
    const newItem = plainToClass(Configs, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateConfigsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Configs> = Object.assign(item, dto);
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
