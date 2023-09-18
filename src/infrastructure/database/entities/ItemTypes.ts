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
@Entity('ItemTypes', { schema: 'services' })
export class ItemTypes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'DatacenterName', nullable: true, length: 50 })
  datacenterName: string | null;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('nvarchar', { name: 'Unit' })
  unit: string;

  @Column('float', { name: 'Fee', precision: 53 })
  fee: number;

  @Column('int', { name: 'MaxAvailable' })
  maxAvailable: number;

  @Column('varchar', { name: 'Code', length: 255 })
  code: string;

  @Column('int', { name: 'MaxPerRequest', nullable: true })
  maxPerRequest: number | null;

  @Column('int', { name: 'MinPerRequest', nullable: true })
  minPerRequest: number | null;

  @Column('varchar', { name: 'ServiceTypeID', length: 50 })
  serviceTypeId: string;

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
