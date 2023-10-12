import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { isNil } from 'lodash';
import { InvoiceItemLimits } from '../enum/invoice-item-limits.enum';
import { And, In, Like, Not } from 'typeorm';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { VdcParentType } from '../interface/vdc-item-parent-type.interface';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from '../../datacenter/interface/datacenter.interface';
import { ItemTypeCodes } from '../../itemType/enum/item-type-codes.enum';

@Injectable()
export class InvoiceValidationService {
  vdcCode: string;
  constructor(
    private readonly serviceItemsSumService: ServiceItemsSumService,
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly datacenterService: BaseDatacenterService,
    private readonly serviceItemTypesTreeService: ServiceItemTypesTreeService,
  ) {
    this.vdcCode = 'vdc';
  }

  async vdcInvoiceValidator(invoice: CreateServiceInvoiceDto): Promise<void> {
    const itemParentType = new VdcParentType();
    this.checkUniquenessOfItems(invoice.itemsTypes);
    let datacenterChecked = false;
    for (const invoiceItem of invoice.itemsTypes) {
      await this.generalInvoiceValidator(invoiceItem);
      const targetInvoiceItem = await this.serviceItemTypesTreeService.findById(
        invoiceItem.itemTypeId,
      );
      // group items by first parent item type eg: generation, reservation, etc
      const parents = targetInvoiceItem.hierarchy.split('_');
      const firstParent = await this.serviceItemTypesTreeService.findById(
        parseInt(parents[0]),
      );
      switch (firstParent.code) {
        case ItemTypeCodes.Guaranty:
          itemParentType.guaranty.push(targetInvoiceItem.hierarchy);
          break;
        case ItemTypeCodes.Period:
          itemParentType.period.push(targetInvoiceItem.hierarchy);
          break;
        case ItemTypeCodes.Generation:
          itemParentType.generation.push(targetInvoiceItem.hierarchy);
          break;
        case ItemTypeCodes.CpuReservation:
          itemParentType.cpuReservation.push(targetInvoiceItem.hierarchy);
          break;
        case ItemTypeCodes.MemoryReservation:
          itemParentType.memoryReservation.push(targetInvoiceItem.hierarchy);
      }
      // checks provider vdc status
      if (
        firstParent.code.toLowerCase() === 'generation' &&
        !datacenterChecked
      ) {
        const secondParent = await this.serviceItemTypesTreeService.findById(
          parseInt(parents[1]),
        );
        await this.checkVdcDatacenterState(
          targetInvoiceItem.datacenterName.toLowerCase(),
          secondParent.code.toLowerCase(),
        );
        datacenterChecked = true;
      }
    }
    // check items with default vdc service items
    await this.compareWithVdcDefaultService(itemParentType);

    // checks if an item has different parents
    this.checkItemsHasSameParents(itemParentType);
  }

  async generalInvoiceValidator(invoiceItem: InvoiceItemsDto): Promise<void> {
    const targetInvoiceItem = await this.serviceItemTypesTreeService.findById(
      invoiceItem.itemTypeId,
    );
    //checks if itemType exists
    if (!targetInvoiceItem) {
      throw new BadRequestException(
        `item [${invoiceItem.itemTypeId}] does not exist`,
      );
    }
    // checks if item is enabled
    if (!targetInvoiceItem.enabled) {
      throw new BadRequestException(
        `item [${invoiceItem.itemTypeId}] is not enabled`,
      );
    }
    // check item is the last child
    const isParent = await this.serviceItemTypesTreeService.findOne({
      where: {
        parentId: targetInvoiceItem.id,
      },
    });
    if (isParent) {
      throw new BadRequestException(
        `item [${targetInvoiceItem.id}] is not last child`,
      );
    }
    // checks only numeric items
    if (!isNaN(parseFloat(invoiceItem.value))) {
      // checks numeric item range
      await this.checkNumericItemTypeValue(invoiceItem, targetInvoiceItem);
    }
    // checks item rule
    // this.checkItemTypeRule(invoiceItem, targetInvoiceItem);
  }

  async checkVdcDatacenterState(
    datacenterName: string,
    generationCode: string,
  ): Promise<void> {
    const availableDatacenters =
      await this.datacenterService.getDatacenterConfigWithGen();
    const targetDatacenter = availableDatacenters.find((dc) => {
      return dc.datacenter === datacenterName;
    });
    if (isNil(targetDatacenter)) {
      throw new BadRequestException(`datacenter is invalid`);
    }
    const generation = targetDatacenter.gens.find(
      (value) => value.name === generationCode,
    );
    if (!generation) {
      throw new BadRequestException(`datacenter is invalid`);
    }
  }

  async compareVdcDefaultGeneration(generaionsList: string[]): Promise<void> {
    // generation child item eg: G1
    let targetGeneration = null;
    let generationHierarchyList = [];
    for (const generation of generaionsList) {
      const hierarchy = generation.split('_');
      targetGeneration = targetGeneration ? targetGeneration : hierarchy[1];
      hierarchy.forEach((value) => {
        generationHierarchyList.push(parseInt(value));
      });
    }
    // unique items
    generationHierarchyList = [...new Set(generationHierarchyList)];
    const generationParentsList = await this.serviceItemTypesTreeService.find({
      where: {
        id: In(generationHierarchyList),
      },
    });
    const generationParentCodes = generationParentsList.map(
      (parent) => parent.codeHierarchy,
    );
    const generationItem = await this.serviceItemTypesTreeService.findById(
      parseInt(targetGeneration),
    );
    const requiredGenerationItemsNotProvided =
      await this.serviceItemTypesTreeService.find({
        where: {
          required: true,
          serviceTypes: { id: this.vdcCode },
          datacenterName: null,
          codeHierarchy: And(
            Like(`${generationItem.codeHierarchy}%`),
            Not(In(generationParentCodes)),
          ),
        },
      });
    if (requiredGenerationItemsNotProvided.length > 0) {
      throw new BadRequestException(`required generation items not provided`);
    }
  }
  async compareWithVdcDefaultService(
    parentTypes: VdcParentType,
  ): Promise<void> {
    // generation items
    await this.compareVdcDefaultGeneration(parentTypes.generation);
    // other items
    const otherItems = [].concat(
      parentTypes.guaranty,
      parentTypes.cpuReservation,
      parentTypes.memoryReservation,
      parentTypes.period,
    );
    let otherItemsHierarchyList = [];
    for (const otherItem of otherItems) {
      const hierarchy: string[] = otherItem.split('_');
      hierarchy.forEach((value) => {
        otherItemsHierarchyList.push(parseInt(value));
      });
    }
    otherItemsHierarchyList = [...new Set(otherItemsHierarchyList)];
    const otherItemsParentsList = await this.serviceItemTypesTreeService.find({
      where: {
        id: In(otherItemsHierarchyList),
      },
    });
    const otherItemsParentCodes = otherItemsParentsList.map(
      (parent) => parent.codeHierarchy,
    );
    const generationCode = 'generation';
    const requiredOtherItemsNotProvided =
      await this.serviceItemTypesTreeService.find({
        where: {
          required: true,
          serviceTypes: { id: this.vdcCode },
          datacenterName: null,
          codeHierarchy: And(
            Not(In(otherItemsParentCodes)),
            Not(Like(`${generationCode}%`)),
          ),
        },
      });
    if (requiredOtherItemsNotProvided.length > 0) {
      throw new BadRequestException(`required items not provided`);
    }
  }

  checkItemsHasSameParents(itemParentType: VdcParentType): void {
    for (const key in itemParentType) {
      if (Object.prototype.hasOwnProperty.call(itemParentType, key)) {
        const itemParent: string[] = itemParentType[key];
        if (itemParent.length === 0) {
          continue;
        }
        const firstItemParents = itemParent[0].split('_');
        const itemHasDifferentParents = itemParent.find((value) => {
          const hierarchy = value.split('_');
          if (
            hierarchy[0] !== firstItemParents[0] ||
            hierarchy[1] !== firstItemParents[1]
          ) {
            return true;
          }
        });
        if (itemHasDifferentParents) {
          throw new BadRequestException('invalid items');
        }
      }
    }
  }
  async checkNumericItemTypeValue(
    invoiceItemType: InvoiceItemsDto,
    // selected item type based on given itemType id
    itemType: ServiceItemTypesTree,
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
      throw new BadRequestException(
        `item [${itemType.id}] is not in correct range`,
      );
    }
    // check if sum of items is more than maxAvailable
    const itemTypeSum = await this.serviceItemsSumService.findOne({
      where: {
        id: itemType.serviceTypeId,
      },
    });
    if (
      checkMaxAvailable &&
      parsedValue + itemTypeSum.sum > itemType.maxAvailable
    ) {
      throw new BadRequestException(
        `insufficient resources for item [${itemType.id}]`,
      );
    }

    // checks if steps mod is zero
    if (parseInt(invoiceItemType.value) % itemType.step !== 0) {
      throw new BadRequestException(
        `item [${itemType.id}] value is not compatible with items step config`,
      );
    }
  }

  checkUniquenessOfItems(invoiceItemTypes: InvoiceItemsDto[]): void {
    const itemIds = invoiceItemTypes.map((item) => item.itemTypeId);
    if (itemIds.length !== new Set(itemIds).size) {
      throw new BadRequestException('items not unique');
    }
  }
  checkItemTypeRule(
    invoiceItemType: InvoiceItemsDto,
    itemType: ServiceItemTypesTree,
  ): void {
    if (!itemType.rule) {
      return;
    }
    const regexRule = new RegExp(itemType.rule);
    if (!invoiceItemType.value.match(regexRule)) {
      throw new BadRequestException(
        `item [${itemType.id}] value does not match default rule for this item`,
      );
    }
  }
}
