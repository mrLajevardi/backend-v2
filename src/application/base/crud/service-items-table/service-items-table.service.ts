import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceItems } from 'src/infrastructure/database/entities/ServiceItems';
import { CreateServiceItemsDto } from './dto/create-service-items.dto';
import { UpdateServiceItemsDto } from './dto/update-service-items.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
  InsertResult,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import {
  JoinServiceItemsAndServiceItemsTypeTreeModelDto,
  JoinServiceItemsAndServiceItemsTypeTreeReturnType,
} from './dto/join-service-item-and-service-items-tree.dto';

@Injectable()
export class ServiceItemsTableService {
  constructor(
    @InjectRepository(ServiceItems)
    private readonly repository: Repository<ServiceItems>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<ServiceItems> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions<ServiceItems>): Promise<ServiceItems[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions<ServiceItems>): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions<ServiceItems>): Promise<ServiceItems> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServiceItemsDto): Promise<ServiceItems> {
    const newItem = plainToClass(ServiceItems, dto);
    const createdItem = this.repository.create(newItem);
    return await this.repository.save(createdItem);
  }

  async createAll(dto: CreateServiceItemsDto[]): Promise<InsertResult> {
    const items: ServiceItems[] = dto.map((item: CreateServiceItemsDto) => {
      return plainToClass(ServiceItems, item);
    });

    return await this.repository.insert(items);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateServiceItemsDto): Promise<ServiceItems> {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceItems> = Object.assign(item, dto);
    return await this.repository.save(updateItem);
  }

  getQueryBuilder() {
    return this.repository.createQueryBuilder('ServiceItem');
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<ServiceItems>,
    dto: UpdateServiceItemsDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(where, dto);
  }

  // delete an Item
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  // delete all items
  async deleteAll(
    where: FindOptionsWhere<ServiceItems>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(where);
  }

  async joinServiceItemsAndServiceItemsTypeTree(
    serviceInstanceId: string,
  ): Promise<
    Omit<JoinServiceItemsAndServiceItemsTypeTreeReturnType, 'build'>[]
  > {
    const queryBuilder = this.repository.createQueryBuilder('ServiceItems');
    const result: JoinServiceItemsAndServiceItemsTypeTreeModelDto[] =
      await queryBuilder
        .select(
          'ServiceItems.ID as ServiceItemsID, ServiceItems.ItemTypeID, ServiceItems.ServiceInstanceID, ServiceItems.Value',
        )
        .where('ServiceItems.ServiceInstanceID = :serviceInstanceId', {
          serviceInstanceId,
        })
        .innerJoin(
          ServiceItemTypesTree,
          'ServiceItemsTree',
          'ServiceItemsTree.ID = ServiceItems.ItemTypeID',
        )
        .addSelect('ServiceItemsTree.CodeHierarchy')
        .printSql()
        .getRawMany();
    const transformedResult: JoinServiceItemsAndServiceItemsTypeTreeReturnType[] =
      result.map((value) =>
        new JoinServiceItemsAndServiceItemsTypeTreeReturnType(value).build(),
      );
    return transformedResult;
  }
}
