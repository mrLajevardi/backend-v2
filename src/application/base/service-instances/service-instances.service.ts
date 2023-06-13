import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { CreateServiceInstancesDto } from 'src/application/base/service-instances/dto/create-service-instances.dto';
import { UpdateServiceInstancesDto } from 'src/application/base/service-instances/dto/update-service-instances.dto';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import { DatabaseErrorException } from 'src/infrastructure/exceptions/database-error.exception';
import { isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { TransactionsService } from '../transactions/transactions.service';
import { UserService } from '../user/user.service';
import { PaymentRequiredException } from 'src/infrastructure/exceptions/payment-required.exception';

@Injectable()
export class ServiceInstancesService {
  constructor(
    @InjectRepository(ServiceInstances)
    private readonly repository: Repository<ServiceInstances>,
    private readonly transactionsService: TransactionsService,
    private readonly userService: UserService,
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<ServiceInstances> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<ServiceInstances[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Exec Sp_CountAradAIUsedEachService
  async spCountAradAiUsedEachService(instanceId: string): Promise<number> {
    const query =
      "EXEC Sp_CountAradAIUsedEachService @ServiceInstanceID='" +
      instanceId +
      "'";
    try {
      const result = await this.repository.query(query);
      return result;
    } catch (err) {
      throw new DatabaseErrorException('sp_count problem', err);
    }
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<ServiceInstances> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServiceInstancesDto) {
    const newItem = plainToClass(ServiceInstances, dto);
    const createdItem = this.repository.create(newItem);
    const result = await this.repository.save(createdItem);
    return result;
  }

  // update many items
  async updateAll(
    where: FindOptionsWhere<ServiceInstances>,
    dto: UpdateServiceInstancesDto,
  ) {
    await this.repository.update(where, dto);
  }

  // Update an Item using updateDTO
  async update(id: string, dto: UpdateServiceInstancesDto) {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceInstances> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // delete an Item
  async delete(id: string) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }

  async payAsYouGoService(serviceInstanceId, cost) {
    if (isNil(serviceInstanceId)) {
      return Promise.reject(new ForbiddenException());
    }
    const service = await this.findOne({
      where: {
        ID: serviceInstanceId,
      },
    });
    if (!service) {
      return Promise.reject(new ForbiddenException());
    }
    const { userId: userId } = service;
    await this.transactionsService.create({
      userId: userId.toString(),
      dateTime: new Date(),
      value: -cost,
      invoiceId: null,
      description: `PAYG`,
      isApproved: true,
      serviceInstanceId: serviceInstanceId,
      paymentType: 2, // payAsYouGo payment method
      paymentToken: null,
    });
    const { credit } = await this.userService.findById(userId);
    if (credit < cost) {
      return Promise.reject(new PaymentRequiredException());
    }
    await this.userService.update(userId, {
      credit: credit - cost,
    });
  }
}
