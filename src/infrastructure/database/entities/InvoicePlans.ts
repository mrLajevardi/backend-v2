import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK_InvoicePlans', ['id'], { unique: true })
@Entity('InvoicePlans', { schema: 'financial' })
export class InvoicePlans {
  @Column('int', { name: 'InvoiceID' })
  invoiceId: number;

  @Column('varchar', { name: 'PlanCode', length: 25 })
  planCode: string;

  @Column('float', { name: 'Ratio', precision: 53 })
  ratio: number;

  @Column('float', { name: 'Amount', precision: 53 })
  amount: number;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;
}
