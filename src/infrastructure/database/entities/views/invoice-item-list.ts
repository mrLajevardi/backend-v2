import { Entity, Column, PrimaryColumn, ViewEntity, ViewColumn } from 'typeorm';
@Entity({
  schema: 'user',
  name: 'InvoiceItemList',
})
export class InvoiceItemList {
  @PrimaryColumn({ name: 'ItemID' })
  itemId: number;

  @Column({ name: 'Quantity' })
  quantity: number;

  @Column({ name: 'Value' })
  value: string;

  @Column({ name: 'Fee' })
  fee: number;

  @Column({ name: 'Code' })
  code: string;

  @Column({ name: 'CodeHierarchy' })
  codeHierarchy: string;

  @Column({ name: 'InvoiceID' })
  invoiceId: number;

  @Column({ name: 'UserID' })
  userId: number;

  @Column({ name: 'InvoiceCode' })
  invoiceCode: number;

  @Column({ name: 'FinalAmount' })
  finalAmount: number;

  @Column({ name: 'BaseAmount' })
  baseAmount: number;

  @Column({ name: 'FinalAmountWithTax' })
  finalAmountWithTax: number;

  @Column({ name: 'RawAmount' })
  rawAmount: number;

  @Column({ name: 'InvoiceTax', type: 'float' })
  invoiceTax: number;

  @Column({ name: 'TemplateID' })
  templateId: number;

  @Column({ name: 'ServiceCost' })
  serviceCost: number;
}
