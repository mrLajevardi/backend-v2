import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discounts } from './Discounts';

@Index('PK_InvoiceDiscounts', ['id'], { unique: true })
@Entity('InvoiceDiscounts', { schema: 'user' })
export class InvoiceDiscounts {
  @Column('int', { name: 'InvoiceID' })
  invoiceId: number;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @ManyToOne(() => Discounts, (discounts) => discounts.invoiceDiscounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'DiscountID', referencedColumnName: 'id' }])
  discount: Discounts;
}
