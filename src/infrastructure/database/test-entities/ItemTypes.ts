import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AiTransactionsLogs } from './AiTransactionsLogs';
import { InvoiceItems } from './InvoiceItems';
import { ServiceTypes } from './ServiceTypes';
import { ServiceItems } from './ServiceItems';

@Index('PK_ResourceTypes', ['id'], { unique: true })
@Entity()
export class ItemTypes {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('nvarchar', { name: 'Unit' })
  unit: string;

  @Column('float', { name: 'Fee', precision: 53 })
  fee: number;

  @Column('integer', { name: 'MaxAvailable' })
  maxAvailable: number;

  @Column('int', { name: 'ServiceTypeID', nullable: true })
  serviceTypeId: string | null;
  
  @Column('varchar', { name: 'Code', length: 255 })
  code: string;

  @Column('integer', { name: 'MaxPerRequest', nullable: true })
  maxPerRequest: number | null;

  @Column('integer', { name: 'MinPerRequest', nullable: true })
  minPerRequest: number | null;

  @OneToMany(
    () => AiTransactionsLogs,
    (aiTransactionsLogs) => aiTransactionsLogs.itemType,
  )
  aiTransactionsLogs: AiTransactionsLogs[];

  @OneToMany(() => InvoiceItems, (invoiceItems) => invoiceItems.item)
  invoiceItems: InvoiceItems[];

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.itemTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ServiceTypeID', referencedColumnName: 'id' }])
  serviceType: ServiceTypes;

  @OneToMany(() => ServiceItems, (serviceItems) => serviceItems.itemType)
  serviceItems: ServiceItems[];
}
