import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discounts } from 'src/infrastructure/database/entities/Discounts';
import { CreateDiscountDto } from 'src/application/base/service/discounts/dto/create-discounts.dto';
import { UpdateDiscountDto } from 'src/application/base/service/discounts/dto/update-discounts.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discounts)
    private readonly repository: Repository<Discounts>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Discounts> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Discounts[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Discounts> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateDiscountDto) {
    const newItem = plainToClass(Discounts, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateDiscountDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Discounts> = Object.assign(item, dto);
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

  // Moved from createService.js
  async findBuiltInDiscount(duration) {
    const builtInDiscounts = [
      {
        duration: 3,
        builtInDiscountCode: 'threeMonthPeriod',
      },
      {
        duration: 6,
        builtInDiscountCode: 'sixMonthPeriod',
      },
    ];
    for (const discount of builtInDiscounts) {
      if (discount.duration === duration) {
        const builtInDiscount = await this.findOne({
          where: {
            code: discount.builtInDiscountCode,
          },
        });
        return Promise.resolve(builtInDiscount);
      }
    }
    return null;
  }
}
