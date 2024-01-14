import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceTypes } from './ServiceTypes';
import { ServicePlanTypeEnum } from '../../../application/base/service/enum/service-plan-type.enum';
import { AiTransactionsLogs } from './AiTransactionsLogs';
import { InvoiceItems } from './InvoiceItems';
import { ServiceItems } from './ServiceItems';
console.log('itemtypes working');

@Index('PK_ResourceTypes', ['id'], { unique: true })
@Entity('ItemTypes', { schema: 'services' })
export class ItemTypes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
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

  @Column('int', { name: 'Max', nullable: true })
  maxPerRequest: number | null;

  @Column('int', { name: 'Min', nullable: true })
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

  @Column('float', { name: 'Percent', nullable: true, precision: 53 })
  percent: number | null;

  @Column('tinyint', { name: 'PrinciplePrice', nullable: true })
  principlePrice: number | null;

  @Column('varchar', { name: 'ServiceTypeID', length: 50 })
  serviceTypeId: string;
  @Column('bit', { name: 'Required', nullable: true })
  required: boolean | null;

  @Column('bit', { name: 'Enabled', nullable: true })
  enabled: boolean | null;

  @Column('int', { name: 'Step', nullable: true })
  step: number | null;

  @Column('bit', { name: 'IsDeleted', default: () => '(0)' })
  isDeleted: boolean;

  @Column('datetime', { name: 'DeleteDate', nullable: true })
  deleteDate: Date | null;

  @Column('tinyint', { name: 'Type', nullable: true })
  type: ServicePlanTypeEnum | null;

  @Column('bit', { name: 'IsHidden', nullable: true })
  isHidden: boolean | null;

  // @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.itemTypes)
  // @JoinColumn([
  //   { name: 'ServiceTypeID', referencedColumnName: 'id' },
  //   { name: 'DatacenterName', referencedColumnName: 'datacenterName' },
  // ])
  // serviceType: ServiceTypes;
  // @OneToMany(
  //   () => AiTransactionsLogs,
  //   (aiTransactionsLogs) => aiTransactionsLogs.itemType,
  // )
  // aiTransactionsLogs: AiTransactionsLogs[];

  // @OneToMany(() => InvoiceItems, (invoiceItems) => invoiceItems.item)
  // invoiceItems: InvoiceItems[];

  // @OneToMany(() => ServiceItems, (serviceItems) => serviceItems.itemType)
  // serviceItems: ServiceItems[];
}
