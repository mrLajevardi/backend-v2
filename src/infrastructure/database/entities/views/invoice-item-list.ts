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
}
