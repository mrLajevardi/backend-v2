import { Injectable } from '@nestjs/common';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../../dto/create-service-invoice.dto';
import { SessionRequest } from '../../../../../infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../../dto/invoice-id.dto';
import { InvoiceTypes } from '../../enum/invoice-type.enum';
import { Templates } from '../../../../../infrastructure/database/entities/Templates';
import { ServiceTypesEnum } from '../../../service/enum/service-types.enum';
import { ItemTypeCodes } from '../../../itemType/enum/item-type-codes.enum';
import { BadRequestException } from '../../../../../infrastructure/exceptions/bad-request.exception';
import { In } from 'typeorm';
import { SystemSettingsPropertyKeysEnum } from '../../../crud/system-settings-table/enum/system-settings-property-keys.enum';
import { ServicePlanTypeEnum } from '../../../service/enum/service-plan-type.enum';
import { CreateInvoiceItemsDto } from '../../../crud/invoice-items-table/dto/create-invoice-items.dto';
import { TemplatesTableService } from '../../../crud/templates/templates-table.service';
import { isNil } from 'lodash';
import { InvoicesTableService } from '../../../crud/invoices-table/invoices-table.service';
import { SystemSettingsTableService } from '../../../crud/system-settings-table/system-settings-table.service';
import { ServiceItemTypesTreeService } from '../../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceTypesTableService } from '../../../crud/service-types-table/service-types-table.service';
import { InvoiceItemsTableService } from '../../../crud/invoice-items-table/invoice-items-table.service';
import { InvoiceDetailBaseDto } from '../../../../vdc/dto/invoice-detail-base.dto';
import { InvoiceItemListService } from '../../../crud/invoice-item-list/invoice-item-list.service';
import { InvoiceBaseStrategyInterface } from '../interface/invoice-base-strategy.interface';

@Injectable()
export class InvoiceAiStrategyService implements InvoiceBaseStrategyInterface {
  constructor(
    private readonly templatesTableService: TemplatesTableService,
    private readonly invoicesTableService: InvoicesTableService,
    private readonly systemSettingsTableService: SystemSettingsTableService,
    private readonly serviceItemTreeTableService: ServiceItemTypesTreeService,
    private readonly serviceTypesTableService: ServiceTypesTableService,
    private readonly invoiceItemsTableService: InvoiceItemsTableService,
    private readonly invoiceItemListService: InvoiceItemListService,
  ) {}
  async createInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    switch (dto.type) {
      case InvoiceTypes.Create:
        return this.createStaticInvoice(dto, options);
      default:
        throw new Error(`Unsupported invoice type: ${dto.type}`);
    }
  }

  async createStaticInvoice(
    data: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    const userId = options.user.userId;

    let dataItemType: InvoiceItemsDto[];
    let invoiceName = null;
    let discountPercent = 1;

    if (data.templateId) {
      const template: Templates = await this.templatesTableService.findById(
        data.templateId,
      );
      invoiceName = template.name;
      const calculateDiscountTemplate: number =
        await this.calculateTemplateDiscount(data.templateId);

      discountPercent = discountPercent - calculateDiscountTemplate;

      dataItemType = await this.convertTemplateToItemType(data.templateId);
    } else {
      const count =
        (await this.invoicesTableService.count({
          where: {
            userId: userId,
            serviceTypeId: ServiceTypesEnum.Ai,
          },
        })) + 1;
      invoiceName = 'سرویس هوش مصنوعی ' + count;
      dataItemType = data.itemsTypes;
    }

    const periodItem = dataItemType.find(
      (item) => item.code === ItemTypeCodes.Period,
    );
    if (!periodItem) {
      throw new BadRequestException('Period item not found');
    }
    const checkPeriodItem = await this.serviceItemTreeTableService.findById(
      periodItem.itemTypeId,
    );
    if (checkPeriodItem.codeHierarchy.split('_')[0] !== ItemTypeCodes.Period) {
      throw new BadRequestException('Invalid period item type');
    }

    const itemTypesId = dataItemType.map((item) => item.itemTypeId);
    const itemTypes = await this.serviceItemTreeTableService.find({
      where: { id: In(itemTypesId) },
    });

    const invoiceItems = dataItemType.map((item) => {
      const itemType = itemTypes.find(
        (serviceItem) => serviceItem.id === item.itemTypeId,
      );
      const fee =
        item.itemTypeId !== checkPeriodItem.id
          ? this.calculateFee(item.value, itemType.fee)
          : null;
      return {
        ItemID: item.itemTypeId,
        Fee: fee,
        value: item.value,
        codeHierarchy: itemType.codeHierarchy,
      };
    });

    const baseAmount = invoiceItems.reduce(
      (acc, item) => acc + item.Fee || 0,
      0,
    );
    const rawAmount = baseAmount * checkPeriodItem.maxPerRequest;
    const finalAmount =
      rawAmount * (1 + checkPeriodItem.percent) * discountPercent;

    // Retrieve tax percent
    const taxPercent = await this.systemSettingsTableService.findOne({
      where: { propertyKey: SystemSettingsPropertyKeysEnum.TaxPercent },
    });

    // const endDate = addMonths(new Date(), checkPeriodItem.maxPerRequest);
    const serviceType = await this.serviceTypesTableService.findOne({
      where: {
        id: ServiceTypesEnum.Ai,
      },
    });

    const invoice = await this.invoicesTableService.create({
      userId,
      baseAmount,
      rawAmount,
      finalAmount,
      dateTime: new Date(),
      // endDateTime: endDate,
      payed: false,
      serviceTypeId: ServiceTypesEnum.Ai,
      invoiceTax: Number(taxPercent.value),
      isPreInvoice: false,
      serviceInstanceId: null,
      description: '',
      serviceCost: rawAmount,
      servicePlanType: ServicePlanTypeEnum.Static,
      voided: false,
      planAmount: 0,
      name: invoiceName,
      datacenterName: serviceType.datacenterName,
      templateId: data.templateId,
    });
    const items: CreateInvoiceItemsDto[] = invoiceItems.map(
      (item): CreateInvoiceItemsDto => {
        return {
          invoiceId: invoice.id,
          itemId: item.ItemID,
          value: item.value?.trim() == '' ? null : item.value,
          fee: item.Fee,
          quantity: 0,
          codeHierarchy: item.codeHierarchy,
        } as CreateInvoiceItemsDto;
      },
    );

    await this.invoiceItemsTableService.createAll(items);

    return { invoiceId: invoice.id };
  }

  async getInvoiceDetails(invoiceId: string): Promise<InvoiceDetailBaseDto> {
    const model = await this.invoiceItemListService.find({
      where: { invoiceId: Number(invoiceId) },
    });
    const res: InvoiceDetailBaseDto = new InvoiceDetailBaseDto();
    (res.serviceType = ServiceTypesEnum.Ai),
      (res.invoiceTax = model[0].invoiceTax),
      (res.invoiceCode = model[0].invoiceCode),
      (res.serviceCost = model[0].serviceCost),
      (res.rawAmount = model[0].rawAmount),
      (res.baseAmount = model[0].baseAmount),
      // discountAmount:item.rawAmount,
      (res.finalPrice = model[0].finalAmount),
      (res.finalPriceTax = model[0].finalAmountWithTax - model[0].finalAmount),
      // templateId:model[0],
      (res.finalPriceWithTax = model[0].finalAmountWithTax),
      (res.name = model[0].name),
      (res.templateId = model[0].templateId?.toString()),
      // finalPriceWithTax:item.rawAmount,
      (res.items = []),
      model.forEach((item) => {
        res.items.push({
          fee: item.fee,
          value: item.value,
          code: item.code,
          codeHierarchy: item.codeHierarchy,
        });
      });
    res.fillTaxAndDiscountProperties();

    return res;
    // throw new Error('Method not implemented.');
  }

  async calculateTemplateDiscount(templateId: string): Promise<number> {
    const template: Templates = await this.templatesTableService.findById(
      templateId,
    );

    if (isNil(template)) {
      throw new BadRequestException();
    }

    const decode = JSON.parse(template.structure);

    if (!isNil(decode.percent)) {
      return Number(decode.percent);
    } else {
      return 0;
    }
  }

  async convertTemplateToItemType(
    templateId: string,
  ): Promise<InvoiceItemsDto[]> {
    const template: Templates = await this.templatesTableService.findById(
      templateId,
    );
    // TODO must be check template belongs to ai templates
    if (isNil(template)) {
      throw new BadRequestException();
    }
    const decode = JSON.parse(template.structure);
    const invoiceItemsDto: InvoiceItemsDto[] = [];

    for (const key of Object.keys(decode.items)) {
      invoiceItemsDto.push({
        itemTypeId: decode.items[key].id,
        value: decode.items[key].value,
        code: decode.items[key].code,
      } as InvoiceItemsDto);
    }

    return invoiceItemsDto;
  }

  calculateFee(value: string | undefined, fee: number): number {
    return !isNil(value) && value.trim() !== '' && Number(value) !== 0
      ? Number(value) * fee
      : fee;
  }
}
