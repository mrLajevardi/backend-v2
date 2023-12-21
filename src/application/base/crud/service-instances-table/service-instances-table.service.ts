import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { CreateServiceInstancesDto } from './dto/create-service-instances.dto';
import { UpdateServiceInstancesDto } from './dto/update-service-instances.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  SelectQueryBuilder,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  ServiceInstanceModel,
  ServiceInstancesDto,
} from './dto/service-instances.dto';

@Injectable()
export class ServiceInstancesTableService {
  private enabledServiceSql = `SELECT ExpireDate, ID, UserID, ServiceTypeID, WarningSent FROM [user].[ServiceInstances]
  WHERE DATEDIFF(dd, ExpireDate, @0) = 0 AND ServiceTypeID = @1 AND IsDeleted=0 AND IsDisabled=0`;
  private disabledServiceSql = `SELECT ExpireDate, ID, UserID, ServiceTypeID, WarningSent FROM [user].[ServiceInstances]
  WHERE DATEDIFF(dd, ExpireDate, @0) = 0 AND ServiceTypeID = @1 AND IsDeleted=0 AND IsDisabled=1`;
  private enabledServiceExtendedSql = `SELECT ExpireDate, ID, UserID, ServiceTypeID, WarningSent, Status FROM [user].[ServiceInstances]
  WHERE (DATEDIFF(dd, ExpireDate, @0) = 0 AND ServiceTypeID = @1 AND IsDeleted=0 AND IsDisabled=0) 
  OR (Status=4 AND ServiceTypeID='vdc' AND IsDeleted=0 AND IsDisabled=0)`;
  private expiredServicesSql = `SELECT ID, NextPAYG
  FROM [user].[ServiceInstances] 
  WHERE DATEDIFF(hh, NextPAYG, @0) > 0 AND ID IN (@1)`;
  constructor(
    @InjectRepository(ServiceInstances)
    private readonly repository: Repository<ServiceInstances>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<ServiceInstances> {
    return this.repository.createQueryBuilder('serviceInstances');
  }

  async enabledServices(params: any[]): Promise<ServiceInstances[]> {
    const result: ServiceInstanceModel[] = await this.repository.query(
      this.enabledServiceSql,
      params,
    );
    const formattedResult: ServiceInstances[] = result.map((item) =>
      new ServiceInstancesDto(item).build(),
    );
    return formattedResult;
  }

  async disabledServices(params: any[]): Promise<ServiceInstances[]> {
    const result: ServiceInstanceModel[] = await this.repository.query(
      this.disabledServiceSql,
      params,
    );
    const formattedResult: ServiceInstances[] = result.map((item) =>
      new ServiceInstancesDto(item).build(),
    );
    return formattedResult;
  }

  async expiredServices(params: any[]): Promise<any> {
    return await this.repository.query(this.expiredServicesSql, params);
  }

  async enabledServiceExtended(params: any[]): Promise<ServiceInstances[]> {
    const result: ServiceInstanceModel[] = await this.repository.query(
      this.enabledServiceExtendedSql,
      params,
    );
    const formattedResult: ServiceInstances[] = result.map((item) =>
      new ServiceInstancesDto(item).build(),
    );
    return formattedResult;
  }

  // Find One Item by its ID
  async findById(id: string): Promise<ServiceInstances> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(
    options?: FindManyOptions<ServiceInstances>,
  ): Promise<ServiceInstances[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<ServiceInstances>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(
    options?: FindOneOptions<ServiceInstances>,
  ): Promise<ServiceInstances> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServiceInstancesDto): Promise<ServiceInstances> {
    const newItem = plainToClass(ServiceInstances, dto);
    const createdItem = this.repository.create(newItem);
    const t = await this.repository.save(createdItem);
    return t;
  }

  // Update an Item using updateDTO
  async update(
    id: string,
    dto: UpdateServiceInstancesDto,
  ): Promise<ServiceInstances> {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceInstances> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<ServiceInstances>,
    dto: UpdateServiceInstancesDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<ServiceInstances>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }
}
