import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sysdiagrams } from 'src/infrastructure/database/entities/Sysdiagrams';
import { CreateSysdiagramsDto } from 'src/application/base/sysdiagrams/dto/create-sysdiagrams.dto';
import { UpdateSysdiagramsDto } from 'src/application/base/sysdiagrams/dto/update-sysdiagrams.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SysdiagramsService {
  constructor(
    @InjectRepository(Sysdiagrams)
    private readonly repository: Repository<Sysdiagrams>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Sysdiagrams> {
    const serviceType = await this.repository.findOne({
      where: { diagramId: id },
    });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Sysdiagrams[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Sysdiagrams> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateSysdiagramsDto) {
    const newItem = plainToClass(Sysdiagrams, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateSysdiagramsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Sysdiagrams> = Object.assign(item, dto);
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
