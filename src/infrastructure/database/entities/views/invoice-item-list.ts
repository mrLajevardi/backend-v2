import { Entity, Column, PrimaryColumn, ViewEntity, ViewColumn } from 'typeorm';
@ViewEntity({
  schema: 'user',
  name: 'InvoiceItemList',
})
export class InvoiceItemList {
  @ViewColumn({ name: 'ItemID' })
  itemId: number;

  @ViewColumn({ name: 'Quantity' })
  quantity: number;

  @ViewColumn({ name: 'Fee' })
  fee: number;

  @ViewColumn({ name: 'Code' })
  code: string;

  @ViewColumn({ name: 'InvoiceID' })
  invoiceId: string;

  @ViewColumn({ name: 'UserID' })
  userId: number;
}
