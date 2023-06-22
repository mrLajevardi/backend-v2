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
@Entity()
export class InvoiceDiscounts {
  @Column('integer', { name: 'InvoiceID' })
  invoiceId: number;

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => Discounts, (discounts) => discounts.invoiceDiscounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'DiscountID', referencedColumnName: 'id' }])
  discount: Discounts;
}
