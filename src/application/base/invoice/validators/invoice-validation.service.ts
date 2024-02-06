import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
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
import {
  DiskItemCodes,
  ItemTypeCodes,
  VdcGenerationItemCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { VdcItemGroup } from '../interface/vdc-item-group.interface.dto';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { UpgradeAndExtendDto } from '../dto/upgrade-and-extend.dto';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ITEM_TYPE_CODE_HIERARCHY_SPLITTER } from '../../itemType/const/item-type-code-hierarchy.const';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';

@Injectable()
export class InvoiceValidationService {
  vdcCode: string;
  constructor(
    // private readonly serviceItemsSumService: ServiceItemsSumService,
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly datacenterService: BaseDatacenterService,
    private readonly serviceItemTypesTreeService: ServiceItemTypesTreeService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
  ) {
    this.vdcCode = 'vdc';
  }

  strategy: any = {
    [ServiceTypesEnum.Vdc]: this.vdcInvoiceValidator,
    [ServiceTypesEnum.Ai]: this.aiInvoiceValidator,
  };

  async invoiceValidator(
    serviceType: ServiceTypesEnum,
    invoice: CreateServiceInvoiceDto,
  ): Promise<void> {
    if (invoice.templateId) {
      return;
    }

    this.checkUniquenessOfItems(invoice.itemsTypes);

    await this.strategy[serviceType].bind(this)(invoice);
  }

  async aiInvoiceValidator(invoice: CreateServiceInvoiceDto): Promise<void> {
    if (!invoice.itemsTypes) {
      throw new BadRequestException('Invoice itemsTypes cannot be empty');
    }

    for (const invoiceItem of invoice.itemsTypes) {
      await this.generalInvoiceValidator(invoiceItem);
    }
  }
  async vdcInvoiceValidator(invoice: CreateServiceInvoiceDto): Promise<void> {
    const itemParentType = new VdcParentType();

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
        firstParent.code.toLowerCase() === ItemTypeCodes.Generation &&
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
    this.checkItemTypeRule(invoiceItem, targetInvoiceItem);
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
      const hierarchy = generation.split(ITEM_TYPE_CODE_HIERARCHY_SPLITTER);
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
      console.log('missing items: ', requiredGenerationItemsNotProvided);
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
      const hierarchy: string[] = otherItem.split(
        ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
      );
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
    const generationCode = ItemTypeCodes.Generation;
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
      console.log('required items:', requiredOtherItemsNotProvided);
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
        const firstItemParents = itemParent[0].split(
          ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
        );
        const itemHasDifferentParents = itemParent.find((value) => {
          const hierarchy = value.split(ITEM_TYPE_CODE_HIERARCHY_SPLITTER);
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
    // const itemTypeSum = await this.serviceItemsSumService.findOne({
    //   where: {
    //     id: itemType.serviceTypeId,
    //   },
    // });
    // if (
    //   checkMaxAvailable &&
    //   parsedValue + itemTypeSum.sum > itemType.maxAvailable
    // ) {
    //   throw new BadRequestException(
    //     `insufficient resources for item [${itemType.id}]`,
    //   );
    // }

    // checks if steps mod is zero
    if (
      itemType.step &&
      parseInt(invoiceItemType.value) % itemType.step !== 0
    ) {
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

  async checkExtendVdcInvoice(
    periodItem: VdcItemGroup['period'],
    service: ServiceInstances,
  ): Promise<void> {
    await this.checkNumericItemTypeValue(
      {
        itemTypeId: periodItem.id,
        value: periodItem.value,
      },
      periodItem,
    );
    if (service.daysLeft > 7) {
      throw new BadRequestException(
        'cannot extend service because service is not expired yet',
      );
    }

    if (periodItem.datacenterName !== service.datacenterName) {
      throw new BadRequestException('invalid period item');
    }
  }

  async checkUpgradeVdc(
    invoice: UpgradeAndExtendDto,
    service: ServiceInstances,
  ): Promise<void> {
    await this.vdcInvoiceValidator({
      ...invoice,
      templateId: null,
      type: InvoiceTypes.Upgrade,
    });
    // serviceItem --> serviceItemTypeTree --> compare hierarchy_code except cpu & ram; cannot decrease any item value;
    const serviceItems =
      await this.serviceItemsTableService.joinServiceItemsAndServiceItemsTypeTree(
        service.id,
      );
    for (const serviceItem of serviceItems) {
      const hierarchy = serviceItem.codeHierarchy
        .split(ITEM_TYPE_CODE_HIERARCHY_SPLITTER)
        .slice(-2);
      let itemFound =
        serviceItem.codeHierarchy.split(
          ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
        )[0] === ItemTypeCodes.Generation
          ? false
          : true;
      if (hierarchy[1] === DiskItemCodes.Swap) {
        itemFound = true;
      }
      for (const invoiceItem of invoice.itemsTypes) {
        const serviceItemTree = await this.serviceItemTypesTreeService.findById(
          invoiceItem.itemTypeId,
        );
        const invoiceItemHierarchy = serviceItemTree.codeHierarchy
          .split(ITEM_TYPE_CODE_HIERARCHY_SPLITTER)
          .slice(-2);
        const computeItem =
          hierarchy[1] === invoiceItemHierarchy[1] &&
          (invoiceItemHierarchy[0] === VdcGenerationItemCodes.Cpu ||
            invoiceItemHierarchy[0] === VdcGenerationItemCodes.Ram) &&
          invoiceItemHierarchy[0] === hierarchy[0];
        if (hierarchy[1] === invoiceItemHierarchy[1] || computeItem) {
          itemFound = true;
          if (
            Number(serviceItem.value) > Number(invoiceItem.value) &&
            serviceItemTree.codeHierarchy !== ItemTypeCodes.Period
          ) {
            throw new BadRequestException('cannot decrease value');
          }

          if (serviceItemTree.datacenterName !== service.datacenterName) {
            throw new BadRequestException('datacenter does not match');
          }

          if (
            serviceItemTree.codeHierarchy.split(
              ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
            )[0] === ItemTypeCodes.Generation
          ) {
            const invoiceItemGenerationNumber = serviceItemTree.codeHierarchy
              .split(ITEM_TYPE_CODE_HIERARCHY_SPLITTER)[1]
              .split('g')[1];
            const serviceItemGenerationNumber = serviceItem.codeHierarchy
              .split(ITEM_TYPE_CODE_HIERARCHY_SPLITTER)[1]
              .split('g')[1];
            if (
              Number(invoiceItemGenerationNumber) !==
              Number(serviceItemGenerationNumber)
            ) {
              throw new BadRequestException(
                'changing generation is not possible',
              );
            }
          }
        }
      }
      if (!itemFound) {
        throw new BadRequestException('cannot remove previous items');
      }
    }
  }
}
