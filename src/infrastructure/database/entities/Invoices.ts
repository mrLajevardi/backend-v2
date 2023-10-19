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
import { User } from './User';
import { ServiceInstances } from './ServiceInstances';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Templates } from './Templates';

@Index('PK_Invoices', ['id'], { unique: true })
@Entity('Invoices', { schema: 'user' })
export class Invoices {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'ServiceTypeID', length: 50, default: () => "''" })
  serviceTypeId: string;

  @Column('nvarchar', { name: 'DatacenterName', length: 50, nullable: true })
  datacenterName: string | null;

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

  @Column(isTestingEnv() ? 'boolean' : 'bit', { name: 'Payed' })
  payed: boolean;

  @Column(isTestingEnv() ? 'boolean' : 'bit', { name: 'Voided' })
  voided: boolean;

  @Column('datetime', { name: 'EndDateTime', default: () => 'getdate()' })
  endDateTime: Date;

  @Column('int', { name: 'Type', default: () => '(0)' })
  type: number;

  @Column('nvarchar', { name: 'Name', nullable: true, length: 50 })
  name: string | null;

  // @Column('tinyint', { name: 'ServicePlanType', nullable: true })
  // servicePlanType: number | null;

  @Column('tinyint', { name: 'ServicePlanType' })
  servicePlanType: number;

  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
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

  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'TemplateID',
    nullable: true,
  })
  templateId: string;
}
