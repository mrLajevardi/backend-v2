import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';
import { ServiceTypesEnum } from '../../base/service/enum/service-types.enum';

export class InvoiceDetailBaseDto extends BaseResultDto {
  constructor() {
    super();
  }
  serviceType?: ServiceTypesEnum;
  finalPrice?: number;
  finalPriceWithTax?: number;
  finalPriceTax?: number;
  rawAmount?: number;
  rawAmountWithTax?: number;
  rawAmountTax?: number;
  templateId?: string;
  name?: string;
  baseAmount?: number;
  serviceCost?: number;
  serviceCostTax?: number;
  invoiceCode?: number;
  serviceCostWithTax?: number;
  invoiceTax?: number;
  serviceCostWithDiscount?: number;
  discountAmount?: number;
  serviceCostFinal?: number;
  items?: InvoiceItemDetailBase[];

  fillTaxAndDiscountProperties(): void {
    // this.discountAmount = this.serviceCost - this.serviceCostWithDiscount;
    this.discountAmount = this.rawAmount - this.finalPrice;
    this.serviceCostTax = this.serviceCost * this.invoiceTax;
    this.serviceCostWithTax = this.serviceCost + this.serviceCostTax;
    this.serviceCostWithDiscount = this.serviceCost - this.discountAmount;
    // this.serviceCostFinal = this.serviceCostWithTax - this.discountAmount;
    this.rawAmountTax = this.rawAmount * this.invoiceTax;
    this.rawAmountWithTax = this.rawAmountTax + this.rawAmount;
    this.finalPriceTax = this.finalPrice * this.invoiceTax;
    this.finalPriceWithTax = this.finalPriceTax + this.finalPrice;
    this.serviceCostFinal = this.serviceCostTax + this.serviceCostWithDiscount;
    // this.serviceCostWithDiscount = this.serviceCostFinal - this.discountAmount;
  }
}

export class InvoiceItemDetailBase extends BaseResultDto {
  fee?: number;
  value?: string;
  code?: string;
  codeHierarchy?: string;
}
