import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { DatacenterService } from '../../datacenter/service/datacenter.service';
import { groupBy, isNil, keyBy } from 'lodash';
import { InvoiceItemLimits } from '../enum/invoice-item-limits.enum';
import { In } from 'typeorm';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';

@Injectable()
export class InvoiceValidationService {
  constructor(
    private readonly itemTypesTableService: ItemTypesTableService,
    private readonly serviceItemsSumService: ServiceItemsSumService,
    private readonly datacenterService: DatacenterService,
    private readonly serviceItemTypesTreeService: ServiceItemTypesTreeService,
  ) {}
  async validateInvoice(invoice: CreateServiceInvoiceDto): Promise<void> {
    let lastParent: string;
    for (const invoiceItem of invoice.itemsTypes) {
      const targetInvoiceItem = await this.itemTypesTableService.findById(
        invoiceItem.itemTypeId,
      );
      if (!targetInvoiceItem) {
        throw new BadRequestException();
      }
      // check item is the last child
      const isParent = await this.itemTypesTableService.findOne({
        where: {
          parentId: targetInvoiceItem.id,
        },
      });
      if (isParent) {
        throw new BadRequestException();
      }
      // checks if parents are the same
      const parents = targetInvoiceItem.hierarchy.split(',');
      if (lastParent && parents[0] !== lastParent) {
        throw new BadRequestException();
      }

      // checks only numeric items
      if (!isNaN(parseFloat(invoiceItem.value))) {
        // checks numeric item range
        await this.checkNumericItemTypeValue(invoiceItem, targetInvoiceItem);
      }

      // checks item rule
      this.checkItemTypeRule(invoiceItem, targetInvoiceItem);

      // checks availability of datacenter
      await this.checkDatacenterState(targetInvoiceItem.datacenterName);
    }
  }

  async checkDatacenterState(datacenterName: string): Promise<void> {
    const availableDatacenters =
      await this.datacenterService.getDatacenterConfigWithGen();
    const targetDatacenter = availableDatacenters.find(
      (dc) => dc.datacenter === datacenterName,
    );
    if (isNil(targetDatacenter)) {
      throw new BadRequestException();
    }
  }

  async compareWithDefaultService(
    serviceTypeId: string,
    invoiceItems: InvoiceItemsDto[],
  ): Promise<void> {
    for (const invoiceItem of invoiceItems) {
      const targetItem = await this.itemTypesTableService.findById(
        invoiceItem.itemTypeId,
      );
      const parents = targetItem.hierarchy.split(',');
      const parentsItems = await this.serviceItemTypesTreeService.find({
        where: {
          id: In(parents.slice(0, 2)),
        },
      });
      const mappedParentItems = keyBy(parentsItems, 'level');

      //checks if first parent and second parent matches with default service
      const firstParentSearch = await this.serviceItemTypesTreeService.findOne({
        where: {
          serviceTypes: { id: serviceTypeId, dataCenterName: null },
          level: 0,
          code: mappedParentItems['0'].code,
        },
      });
      const secondParentSearch = await this.serviceItemTypesTreeService.findOne(
        {
          where: {
            serviceTypes: { id: 'vdc', dataCenterName: null },
            level: 1,
            code: mappedParentItems['1'].code,
          },
        },
      );
      if (isNil(secondParentSearch) || isNil(firstParentSearch)) {
        throw new BadRequestException();
      }
      if (parentsItems['1'].code === 'disk') {
        const thirdParentsSearch = await this.serviceItemTypesTreeService.find({
          where: {
            serviceTypes: { id: 'vdc', dataCenterName: null },
            parentId: secondParentSearch.id,
            level: 2,
          },
        });
        thirdParentsSearch.forEach((defaultParent) => {
          const matched = mappedParentItems['2'].find(
            (parent) => parent.code === defaultParent.code,
          );
          if (!matched) {
            throw new BadRequestException();
          }
        });
      }
    }
  }

  async checkNumericItemTypeValue(
    invoiceItemType: InvoiceItemsDto,
    itemType: ItemTypes,
  ): Promise<void> {
    const checkMax =
      itemType.maxPerRequest !== InvoiceItemLimits.UnlimitedMinValue;
    const checkMin =
      itemType.minPerRequest !== InvoiceItemLimits.UnlimitedMaxValue;
    const checkMaxAvailable =
      itemType.maxAvailable !== InvoiceItemLimits.UnlimitedMaxAvailableValue;
    const parsedValue = parseFloat(invoiceItemType.value);
    const higherThanMax = checkMax && parsedValue > itemType.maxPerRequest;
    const lowerThanMin = checkMin && parsedValue < itemType.minPerRequest;

    //check item type value min and max
    if (higherThanMax || lowerThanMin) {
      throw new BadRequestException();
    }

    // check if sum of items is more than maxAvailable
    const itemTypeSum = await this.serviceItemsSumService.findOne({
      where: {
        id: itemType.serviceType.id,
      },
    });
    if (
      checkMaxAvailable &&
      parsedValue + itemTypeSum.sum > itemType.maxAvailable
    ) {
      throw new BadRequestException();
    }
  }

  checkItemTypeRule(
    invoiceItemType: InvoiceItemsDto,
    itemType: ItemTypes,
  ): void {
    const regexRule = new RegExp(itemType.rule);
    if (!invoiceItemType.value.match(regexRule)) {
      throw new BadRequestException();
    }
  }
}
