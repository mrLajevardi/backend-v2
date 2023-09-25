import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ServiceTypes } from './ServiceTypes';
import { AiTransactionsLogs } from './AiTransactionsLogs';
import { InvoiceItems } from './InvoiceItems';
import { ServiceItems } from './ServiceItems';
import { AiTransactionsLogs } from './AiTransactionsLogs';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK_ResourceTypes', ['id'], { unique: true })
@Entity('ItemTypes', { schema: 'services' })
export class ItemTypes {
  @Column('int', { primary: true, name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'DatacenterName', nullable: true, length: 50 })
  datacenterName: string | null;

  @Column('nvarchar', { name: 'Title', nullable: true })
  title: string | null;

  @Column('nvarchar', { name: 'Unit', nullable: true })
  unit: string | null;

  @Column('float', { name: 'Price', nullable: true, precision: 53 })
  fee: number | null;

  @Column('int', { name: 'MaxAvailable', nullable: true })
  maxAvailable: number | null;

  @Column('varchar', { name: 'Code', nullable: true, length: 255 })
  code: string | null;

  @Column('int', { name: 'MaxPerRequest', nullable: true })
  maxPerRequest: number | null;

  @Column('int', { name: 'MinPerRequest', nullable: true })
  minPerRequest: number | null;

  @Column('nvarchar', { name: 'Rule', nullable: true })
  rule: string | null;

  @Column('int', { name: 'ParentId', nullable: true })
  parentId: number | null;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  createDate: Date | null;

  @Column('int', { name: 'Percent', nullable: true })
  percent: number | null;

  @Column('tinyint', { name: 'PrinciplePrice', nullable: true })
  principlePrice: number | null;

  @Column('nvarchar', { name: 'Hierarchy', nullable: true, length: 50 })
  hierarchy: string | null;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.itemTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ServiceTypeID', referencedColumnName: 'id' }])
  serviceType: ServiceTypes;

  @Column('varchar', { name: 'ServiceTypeID', length: 50 })
  serviceTypeId: string;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    // default: () => 'getdate()',
  })
  createDate: Date | null;

  @Column('int', { name: 'Percent', nullable: true })
  percent: number | null;

  @Column('tinyint', { name: 'PrinciplePrice', nullable: true })
  principlePrice: number | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'Required',
    nullable: true,
  })
  required: boolean | null;
  @OneToMany(
    () => AiTransactionsLogs,
    (aiTransactionsLogs) => aiTransactionsLogs.itemType,
  )
  aiTransactionsLogs: AiTransactionsLogs[];
  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'Enabled',
    nullable: true,
  })
  enabled: boolean | null;

  @Column('int', { name: 'Step', nullable: true })
  step: number | null;
  @OneToMany(() => InvoiceItems, (invoiceItems) => invoiceItems.item)
  invoiceItems: InvoiceItems[];

  @OneToMany(() => ServiceItems, (serviceItems) => serviceItems.itemType)
  serviceItems: ServiceItems[];
}
