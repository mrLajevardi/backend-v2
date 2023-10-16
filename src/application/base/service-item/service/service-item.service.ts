import { BaseService } from '../../../../infrastructure/service/BaseService';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { BaseServiceItem } from '../interface/service/service-item.interface';
import { ItemTypes } from '../../../../infrastructure/database/entities/ItemTypes';
import { ItemTypeCodes } from '../../itemType/enum/item-type-codes.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceItemService implements BaseService, BaseServiceItem {
  constructor(
    private readonly serviceItemsTableService: ServiceItemsTableService,
  ) {}
  async getGuarantyTitleBy(serviceInstanceId: string): Promise<string> {
    //TODO --> Convert QueryBuilder To Model
    const queryBuilder = this.serviceItemsTableService
      .getQueryBuilder()
      .innerJoin(ItemTypes, 'It', 'It.ID =ServiceItem.ItemTypeID')
      .where('ServiceItem.ServiceInstanceID=:serviceInstanceId', {
        serviceInstanceId: serviceInstanceId,
      })
      .where('It.Code =:guarantyItemCode', {
        guarantyItemCode: ItemTypeCodes.GuarantyItem,
      })
      .select('It.Title');

    const res = await queryBuilder.getRawOne<{ Title: string }>();

    return Promise.resolve(res.Title);
  }
}
