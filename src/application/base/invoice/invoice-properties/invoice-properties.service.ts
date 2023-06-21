import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceProperties } from 'src/infrastructure/database/entities/InvoiceProperties';
import { CreateInvoicePropertiesDto } from 'src/application/base/invoice/invoice-properties/dto/create-invoice-properties.dto';
import { UpdateInvoicePropertiesDto } from 'src/application/base/invoice/invoice-properties/dto/update-invoice-properties.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { VgpuPcNamePassRequired } from 'src/infrastructure/exceptions/vgpu-pc-name-pass-required.exception';
import { isNil } from 'lodash';

@Injectable()
export class InvoicePropertiesService {
  constructor(
    @InjectRepository(InvoiceProperties)
    private readonly repository: Repository<InvoiceProperties>,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<InvoiceProperties> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<InvoiceProperties[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<InvoiceProperties> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoicePropertiesDto) {
    const newItem = plainToClass(InvoiceProperties, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  async createInvoiceProperties(data, InvoiceID, serviceType) {
    if (serviceType == 'vgpu') {
      const pcProp = {
        pcName: data.pcName,
        pcPassword: data.pcPassword,
      };
      if (isNil(data.pcName) || isNil(data.pcPassword)) {
        return Promise.reject(new VgpuPcNamePassRequired());
      }
      for (const item of Object.keys(pcProp)) {
        await this.repository.create({
          invoiceId: InvoiceID,
          propertyKey: item,
          value: pcProp[item],
        });
      }
    }
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInvoicePropertiesDto) {
    const item = await this.findById(id);
    const updateItem: Partial<InvoiceProperties> = Object.assign(item, dto);
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
