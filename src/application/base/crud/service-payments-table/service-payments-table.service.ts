import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePayments } from '../../../../infrastructure/database/entities/ServicePayments';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateServicePaymentsDto } from './dto/create-service-payments.dto';
import { plainToClass } from 'class-transformer';
import { UpdateServicePaymentsDto } from './dto/update-service-payments.dto';

@Injectable()
export class ServicePaymentsTableService {
  constructor(
    @InjectRepository(ServicePayments)
    private readonly repository: Repository<ServicePayments>,
  ) {}

  async findById(id: string): Promise<ServicePayments | null> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async find(
    options?: FindManyOptions<ServicePayments>,
  ): Promise<ServicePayments[]> {
    return await this.repository.find(options);
  }

  async count(options?: FindManyOptions<ServicePayments>): Promise<number> {
    return await this.repository.count(options);
  }

  async create(dto: CreateServicePaymentsDto): Promise<ServicePayments> {
    const newItem = plainToClass(ServicePayments, dto);
    const createdItem = this.repository.create(newItem);

    return await this.repository.save(createdItem);
  }

  async updateAll(
    where: FindOptionsWhere<ServicePayments>,
    dto: UpdateServicePaymentsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  async update(
    id: string,
    dto: UpdateServicePaymentsDto,
  ): Promise<ServicePayments> {
    const item = await this.findById(id);
    const updateItem: Partial<ServicePayments> = Object.assign(item, dto);

    return await this.repository.save(updateItem);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async deleteAll(
    where: FindOptionsWhere<ServicePayments> = {},
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }

  async findOne(
    options?: FindOneOptions<ServicePayments>,
  ): Promise<ServicePayments> {
    return await this.repository.findOne(options);
  }
}
