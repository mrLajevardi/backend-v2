import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../../../infrastructure/database/entities/Company';
import {
  DeleteResult,
  FindManyOptions, FindOneOptions,
  FindOptionsWhere,
  Repository, SaveOptions,
  UpdateResult,
} from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { plainToClass } from 'class-transformer';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyTableService {
  constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>,
  ) {}

  async findById(id: number): Promise<Company | null> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async find(options?: FindManyOptions<Company>): Promise<Company[]> {
    return await this.repository.find(options);
  }

  async count(options?: FindManyOptions<Company>): Promise<number> {
    return await this.repository.count(options);
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    const newItem = plainToClass(Company, dto);
    const createdItem = this.repository.create(newItem);

    return await this.repository.save(createdItem);
  }

  async updateAll(
    where: FindOptionsWhere<Company>,
    dto: UpdateCompanyDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
    const item = await this.findById(id);
    const updateItem: Partial<Company> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async deleteAll(
    where: FindOptionsWhere<Company> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }

  async findOne(options?: FindOneOptions<Company>): Promise<Company> {
    return await this.repository.findOne(options);
  }

  async updateWithOptions(
      dto: UpdateCompanyDto,
      saveOption: SaveOptions,
      option: FindOneOptions<Company>,
  ): Promise<Company> {
    const item = await this.findOne(option);
    const updateItem: Partial<Company> = Object.assign(item, dto);

    return await this.repository.save(updateItem, option);
  }
}
