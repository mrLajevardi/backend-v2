import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoices } from './Invoices';
import { ItemTypes } from './ItemTypes';

@Index('PK_InvoiceItems', ['id'], { unique: true })
@Entity('InvoiceItems', { schema: 'user' })
export class InvoiceItems {
  @Column('int', { name: 'ItemID' })
  itemId: number;
  @Column('int', { name: 'InvoiceID' })
  invoiceId: number;

  @Column('float', { name: 'Quantity', precision: 53 })
  quantity: number;

  @Column('float', { name: 'Fee', precision: 53 })
  fee: number;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'Value' })
  value: string;

  @Column('nvarchar', { name: 'CodeHierarchy' })
  codeHierarchy: string;

  @ManyToOne(() => Invoices, (invoices) => invoices.invoiceItems)
  @JoinColumn([{ name: 'InvoiceID', referencedColumnName: 'id' }])
  invoice: Invoices;
  @ManyToOne(() => ItemTypes, (itemTypes) => itemTypes.invoiceItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ItemID', referencedColumnName: 'id' }])
  item: ItemTypes;
}
