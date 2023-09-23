import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { DatacenterService } from '../../datacenter/service/datacenter.service';
import { isNil } from 'lodash';
import { InvoiceItemLimits } from '../enum/invoice-item-limits.enum';
import { In } from 'typeorm';

@Injectable()
export class InvoiceValidationService {
  constructor(
    private readonly itemTypesTableService: ItemTypesTableService,
    private readonly serviceItemsSumService: ServiceItemsSumService,
    private readonly datacenterService: DatacenterService,
  ) {}
  async validateVdcInvoice(invoice: CreateServiceInvoiceDto): Promise<void> {
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

  // async checkDiskValidator(itemType): Promise<void> {}

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

  async compareWithVdcDefaultService(
    invoiceItems: InvoiceItemsDto[],
  ): Promise<void> {
    for (const invoiceItem of invoiceItems) {
      const targetItem = await this.itemTypesTableService.findById(
        invoiceItem.itemTypeId,
      );
      const parents = targetItem.hierarchy.split(',');
      const parentsItems = await this.itemTypesTableService.find({
        where: {
          id: In(parents),
        },
      });
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
