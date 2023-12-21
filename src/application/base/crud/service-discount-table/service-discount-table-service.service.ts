import { Injectable } from '@nestjs/common';
import { ServiceDiscount } from 'src/infrastructure/database/entities/ServiceDiscount';
import { BaseTableService } from 'src/infrastructure/service/base-table';
import { UpdateServiceDiscountDto } from './dto/update-service-discount.dto';
import { CreateServiceDiscountDto } from './dto/create-service-discount.dto';

@Injectable()
export class ServiceDiscountTableService extends BaseTableService<
  ServiceDiscount,
  CreateServiceDiscountDto,
  UpdateServiceDiscountDto
>(ServiceDiscount) {}
