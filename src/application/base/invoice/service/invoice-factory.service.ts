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
import {
  TemplateGenerationItemsDto,
  TemplateItem,
  TemplatesStructure,
} from 'src/application/vdc/dto/templates.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { CostCalculationService } from './cost-calculation.service';

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
    remainingDays: number,
    date: Date,
  ): Promise<CreateInvoicesDto> {
    const dto: CreateInvoicesDto = {
      userId: Number(userId),
      servicePlanType: data.servicePlanTypes,
      rawAmount: invoiceCost.totalCost,
      finalAmount: invoiceCost.totalCost,
      type: data.type,
      endDateTime: addMonths(date, remainingDays),
      dateTime: new Date(),
      serviceTypeId: groupedItems.generation.ip[0].serviceTypeId,
      name: 'invoice' + Math.floor(Math.random() * 100),
      planAmount: 0,
      planRatio: 0,
      payed: false,
      voided: false,
      serviceInstanceId,
      description: '',
      datacenterName: groupedItems.generation.vm[0].datacenterName,
      templateId: data.templateId,
    };
    // data.templateId ? (dto.templateId = data.templateId) : null;
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

  convertTemplateToInvoiceItems(
    templateStructure: TemplatesStructure,
  ): InvoiceItemsDto[] {
    const templateItems = templateStructure.items;
    const generation = 'generation';
    const invoiceItems: InvoiceItemsDto[] = [];
    for (const key in templateItems) {
      if (Object.prototype.hasOwnProperty.call(templateStructure.items, key)) {
        if (key === generation) {
          const generationItems: TemplateGenerationItemsDto =
            templateItems[key];
          for (const generationKey in generationItems) {
            if (
              Object.prototype.hasOwnProperty.call(
                generationItems,
                generationKey,
              )
            ) {
              const generationItem: TemplateItem =
                generationItems[generationKey];
              if (generationKey === VdcGenerationItemCodes.Disk) {
                const diskItem: TemplateItem[] = generationItems[generationKey];
                for (const item of diskItem) {
                  const invoiceItem: InvoiceItemsDto = {
                    itemTypeId: item.id,
                    value: item.value.toString(),
                  };
                  invoiceItems.push(invoiceItem);
                }
              } else {
                const invoiceItem: InvoiceItemsDto = {
                  itemTypeId: generationItem.id,
                  value: generationItem.value.toString(),
                };
                invoiceItems.push(invoiceItem);
              }
            }
          }
        } else {
          const templateItem: TemplateItem = templateItems[key];
          const invoiceItem: InvoiceItemsDto = {
            itemTypeId: templateItem.id,
            value: templateItem.value.toString(),
          };
          invoiceItems.push(invoiceItem);
        }
      }
    }
    return invoiceItems;
  }
}
