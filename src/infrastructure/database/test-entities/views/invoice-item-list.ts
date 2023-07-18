import { Entity, Column, PrimaryColumn, ViewEntity, ViewColumn } from 'typeorm';
@Entity({
  schema: 'user',
  name: 'InvoiceItemList',
})
export class InvoiceItemList {
  @PrimaryColumn()
  itemId: number;

  @Column({ name: 'Quantity' })
  quantity: number;

  @Column({ name: 'Fee' })
  fee: number;

  @Column({ name: 'Code' })
  code: string;

  @Column({ name: 'InvoiceID' })
  invoiceId: string;

  @Column({ name: 'UserID' })
  userId: number;
}
