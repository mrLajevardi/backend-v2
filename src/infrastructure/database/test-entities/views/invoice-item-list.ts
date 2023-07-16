import { Entity, Column } from 'typeorm';
@Entity()
export class InvoiceItemList {
  @Column({ type: 'int', name: 'ItemID' })
  itemId: number;

  @Column({ type: 'int', name: 'Quantity' })
  quantity: number;

  @Column({ type: 'int', name: 'Fee' })
  fee: number;

  @Column({ type: 'varchar', name: 'Code' })
  code: string;

  @Column({ type: 'int', name: 'InvoiceID' })
  invoiceId: string;

  @Column({ type: 'int', name: 'UserID' })
  userId: number;
}
