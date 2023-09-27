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

@Injectable()
export class InvoiceFactoryService {
  constructor(
    private readonly serviceItemTypeTree: ServiceItemTypesTreeService,
  ) {}
  async groupVdcItems(invoiceItems: InvoiceItemsDto[]): Promise<VdcItemGroup> {
    const vdcItemGroup: VdcItemGroup = {} as VdcItemGroup;
    for (const invoiceItem of invoiceItems) {
      const itemType = await this.serviceItemTypeTree.findById(
        invoiceItem.itemTypeId,
      );
      const hierarchy = itemType.hierarchy.split('_');
      const parents = await this.serviceItemTypeTree.find({
        where: {
          id: In(hierarchy),
        },
        order: {
          level: 'ASC',
        },
      });
      switch (parents[0].code) {
        case ItemTypeCodes.Period:
          vdcItemGroup.period = {
            ...itemType,
            value: invoiceItem.value,
          };
          break;
        case ItemTypeCodes.Generation:
          vdcItemGroup.generation = this.groupVdcGenerationItems(
            parents,
            invoiceItem,
            itemType,
          );
          break;
        case ItemTypeCodes.CpuReservation:
          vdcItemGroup.cpuReservation = {
            ...itemType,
            value: invoiceItem.value,
          };
          break;
        case ItemTypeCodes.MemoryReservation:
          vdcItemGroup.memoryReservation = {
            ...itemType,
            value: invoiceItem.value,
          };
          break;
      }
    }
    return vdcItemGroup;
  }

  groupVdcGenerationItems(
    parents: ServiceItemTypesTree[],
    invoiceItem: InvoiceItemsDto,
    itemType: ServiceItemTypesTree,
  ): VdcGenerationItems {
    const generationGroups: VdcGenerationItems = {} as VdcGenerationItems;
    for (const key in VdcGenerationItemCodes) {
      if (Object.prototype.hasOwnProperty.call(VdcGenerationItemCodes, key)) {
        const generationItemCode = VdcGenerationItemCodes[key];
        const item = parents.find(
          (parent) => parent.code === generationItemCode,
        );
        if (item) {
          const lowerCaseKey = key.charAt(0).toLowerCase();
          generationGroups[lowerCaseKey].push({
            ...itemType,
            value: invoiceItem.value,
          });
        }
      }
    }
    return generationGroups;
  }
}
