import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceItems } from './InvoiceItems';
import { ServiceInstances } from './ServiceInstances';
import { User } from './User';
import { Templates } from './Templates';

@Index('PK_Invoices', ['id'], { unique: true })
@Entity('Invoices', { schema: 'user' })
export class Invoices {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'ServiceTypeID', length: 50, default: () => "''" })
  serviceTypeId: string;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('float', { name: 'RawAmount', precision: 53 })
  rawAmount: number;

  @Column('float', { name: 'PlanAmount', precision: 53 })
  planAmount: number;

  @Column('float', { name: 'PlanRatio', nullable: true, precision: 53 })
  planRatio: number | null;

  @Column('float', { name: 'FinalAmount', precision: 53 })
  finalAmount: number;

  @Column('nvarchar', { name: 'Description' })
  description: string;

  @Column('datetime', { name: 'DateTime' })
  dateTime: Date;

  @Column('bit', { name: 'Payed' })
  payed: boolean;

  @Column('bit', { name: 'Voided' })
  voided: boolean;

  @Column('datetime', { name: 'EndDateTime', default: () => 'getdate()' })
  endDateTime: Date;

  @Column('int', { name: 'Type', default: () => '(0)' })
  type: number;

  @Column('nvarchar', { name: 'Name', nullable: true, length: 50 })
  name: string | null;

  @Column('tinyint', { name: 'ServicePlanType', nullable: true })
  servicePlanType: number | null;

  @Column('nvarchar', { name: 'DatacenterName', nullable: true, length: 50 })
  datacenterName: string | null;

  @Column('uniqueidentifier', { name: 'TemplateID', nullable: true })
  templateId: string | null;

  @Column('int', { name: 'ParentInvoiceId', nullable: true })
  parentInvoiceId: number | null;

  @Column('bit', { name: 'IsPreInvoice', default: () => '(0)' })
  isPreInvoice: boolean;

  @Column('float', { name: 'BaseAmount', nullable: true, precision: 53 })
  baseAmount: number | null;

  @Column('decimal', { name: 'Code', nullable: true, precision: 18, scale: 0 })
  code: number | null;

  @Column('decimal', {
    name: 'ServiceCost',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  serviceCost: number | null;

  @Column('float', { name: 'InvoiceTax', nullable: true, precision: 53 })
  invoiceTax: number | null;

  @Column({
    name: 'FinalAmountWithTax',
    nullable: true,
    type: 'float',
    precision: 53,
    insert: false,
  })
  finalAmountWithTax: number | null;

  @Column('tinyint', { name: 'PreInvoiceState', nullable: true })
  preInvoiceState: number | null;
  @Column('uniqueidentifier', {
    name: 'ServiceInstanceID',
  })
  serviceInstanceId: string;
  @OneToMany(() => InvoiceItems, (invoiceItems) => invoiceItems.invoice)
  invoiceItems: InvoiceItems[];

  @ManyToOne(() => User, (user) => user.invoices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserID', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.invoices,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  serviceInstance: ServiceInstances;

  @ManyToOne(() => Templates, (template) => template.invoices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'TemplateID', referencedColumnName: 'guid' }])
  templates: Templates;
}
