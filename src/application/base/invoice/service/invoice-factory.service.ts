import { Injectable } from '@nestjs/common';
import {
  VdcGenerationItems,
  VdcItemGroup,
} from '../interface/vdc-item-group.interface.dto';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import {
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { In } from 'typeorm';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import {
  InvoiceItemCost,
  TotalInvoiceItemCosts,
} from '../interface/invoice-item-cost.interface';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { MappedItemTypes } from '../interface/mapped-item-types.interface';
import { CreateInvoicesDto } from '../../crud/invoices-table/dto/create-invoices.dto';
import { addMonths } from '../../../../infrastructure/helpers/date-time.helper';

@Injectable()
export class InvoiceFactoryService {
  constructor(
    private readonly serviceItemTypeTree: ServiceItemTypesTreeService,
    private readonly invoiceItemTableService: InvoiceItemsTableService,
  ) {}
  async groupVdcItems(invoiceItems: InvoiceItemsDto[]): Promise<VdcItemGroup> {
    const vdcItemGroup: VdcItemGroup = {} as VdcItemGroup;
    const generationGroups = new VdcGenerationItems();
    const mappedItemTypes = new MappedItemTypes();
    invoiceItems.forEach((invoiceItem) => {
      mappedItemTypes.ItemTypesById[invoiceItem.itemTypeId] = invoiceItem;
      mappedItemTypes.itemTypeIds.push(invoiceItem.itemTypeId);
    });
    const itemTypes = await this.serviceItemTypeTree.find({
      where: {
        id: In(mappedItemTypes.itemTypeIds),
      },
    });
    for (const itemType of itemTypes) {
      const parents = itemType.codeHierarchy.split('_');
      const invoiceItem = mappedItemTypes.ItemTypesById[itemType.id];
      const invoiceGroupItem = {
        ...itemType,
        value: invoiceItem.value,
      };
      switch (parents[0]) {
        case ItemTypeCodes.Period:
          vdcItemGroup.period = invoiceGroupItem;
          break;
        case ItemTypeCodes.Generation:
          this.groupVdcGenerationItems(
            parents,
            invoiceItem,
            itemType,
            generationGroups,
          );
          break;
        case ItemTypeCodes.CpuReservation:
          vdcItemGroup.cpuReservation = invoiceGroupItem;
          break;
        case ItemTypeCodes.MemoryReservation:
          vdcItemGroup.memoryReservation = invoiceGroupItem;
          break;
        case ItemTypeCodes.Guaranty:
          vdcItemGroup.guaranty = invoiceGroupItem;
          break;
      }
    }
    // for (const invoiceItem of invoiceItems) {
    //   const itemType = await this.serviceItemTypeTree.findById(
    //     invoiceItem.itemTypeId,
    //   );
    // }
    vdcItemGroup.generation = generationGroups;
    return vdcItemGroup;
  }

  groupVdcGenerationItems(
    parents: string[],
    invoiceItem: InvoiceItemsDto,
    itemType: ServiceItemTypesTree,
    generationGroups: VdcGenerationItems,
  ): VdcGenerationItems {
    for (const key in VdcGenerationItemCodes) {
      if (Object.prototype.hasOwnProperty.call(VdcGenerationItemCodes, key)) {
        const generationItemCode = VdcGenerationItemCodes[key];
        const item = parents.find((parent) => parent === generationItemCode);
        if (item) {
          const lowerCaseKey =
            key.charAt(0).toLowerCase() + key.slice(1, key.length);
          generationGroups[lowerCaseKey].push({
            ...itemType,
            value: invoiceItem.value,
          });
        }
      }
    }
    return generationGroups;
  }

  async createInvoiceDto(
    userId: number,
    data: CreateServiceInvoiceDto,
    invoiceCost: TotalInvoiceItemCosts,
    groupedItems: VdcItemGroup,
    serviceInstanceId: string,
  ) {
    const dto: CreateInvoicesDto = {
      userId,
      servicePlanType: data.servicePlanTypes,
      rawAmount: invoiceCost.totalCost,
      finalAmount: invoiceCost.totalCost,
      type: data.type,
      endDateTime: addMonths(new Date(), parseInt(groupedItems.period.value)),
      dateTime: new Date(),
      serviceTypeId: groupedItems.generation.ip[0].serviceTypeId,
      name: 'invoice' + Math.floor(Math.random() * 100),
      planAmount: 0,
      planRatio: 0,
      payed: false,
      voided: false,
      serviceInstanceId,
      description: '',
    };
    return dto;
  }

  async createInvoiceItems(
    invoiceId: number,
    invoiceItems: InvoiceItemCost[],
  ): Promise<void> {
    for (const item of invoiceItems) {
      await this.invoiceItemTableService.create({
        itemId: item.id,
        invoiceId: invoiceId,
        quantity: 0,
        value: item.value,
        fee: item.cost || null,
      });
    }
  }
}
