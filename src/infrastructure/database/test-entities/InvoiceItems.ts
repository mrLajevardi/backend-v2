import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemTypes } from './ItemTypes';

@Index('PK_InvoiceItems', ['id'], { unique: true })
@Entity()
export class InvoiceItems {
  @Column('integer', { name: 'InvoiceID' })
  invoiceId: number;

  @Column('float', { name: 'Quantity', precision: 53 })
  quantity: number;

  @Column('float', { name: 'Fee', precision: 53 })
  fee: number;

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('int', { name: 'ItemID' })
  itemId: number;

  @ManyToOne(() => ItemTypes, (itemTypes) => itemTypes.invoiceItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ItemID', referencedColumnName: 'id' }])
  item: ItemTypes;
}
