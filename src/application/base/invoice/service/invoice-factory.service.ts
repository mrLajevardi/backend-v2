import { Injectable } from '@nestjs/common';
import {
  VdcGenerationItems,
  VdcItemGroup,
} from '../interface/vdc-item-group.interface.dto';
import { InvoiceItemsDto } from '../dto/create-service-invoice.dto';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import {
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../enum/item-type-codes.enum';
import { In } from 'typeorm';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { InvoiceItemCost } from '../interface/invoice-item-cost.interface';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { MappedItemTypes } from '../interface/mapped-item-types.interface';

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
      const hierarchy = itemType.hierarchy.split('_');
      const parents = await this.serviceItemTypeTree.find({
        where: {
          id: In(hierarchy),
        },
        order: {
          level: 'ASC',
        },
      });
      const invoiceItem = mappedItemTypes.ItemTypesById[itemType.id];
      const invoiceGroupItem = {
        ...itemType,
        value: invoiceItem.value,
      };
      switch (parents[0].code) {
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
    parents: ServiceItemTypesTree[],
    invoiceItem: InvoiceItemsDto,
    itemType: ServiceItemTypesTree,
    generationGroups: VdcGenerationItems,
  ): VdcGenerationItems {
    for (const key in VdcGenerationItemCodes) {
      if (Object.prototype.hasOwnProperty.call(VdcGenerationItemCodes, key)) {
        const generationItemCode = VdcGenerationItemCodes[key];
        const item = parents.find(
          (parent) => parent.code === generationItemCode,
        );
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
