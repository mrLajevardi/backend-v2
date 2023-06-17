import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceItems } from 'src/infrastructure/database/entities/ServiceItems';
import { CreateServiceItemsDto } from 'src/application/base/service/service-items/dto/create-service-items.dto';
import { UpdateServiceItemsDto } from 'src/application/base/service/service-items/dto/update-service-items.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServiceItemsService {
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
  async find(options?: FindManyOptions): Promise<ServiceItems[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<ServiceItems> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServiceItemsDto) {
    const newItem = plainToClass(ServiceItems, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Create Service Items
  async createServiceItems(serviceInstanceID, items, data) {
    for (const item of Object.keys(items)) {
      let dto: CreateServiceItemsDto;
      const itemTitle = items[item].Code;
      dto.quantity = data[itemTitle];
      dto.itemTypeId = items[item].ID;
      dto.serviceInstanceId = serviceInstanceID;
      dto.itemTypeCode = items[item].Code;
      await this.create(dto);
    }
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateServiceItemsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceItems> = Object.assign(item, dto);
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
