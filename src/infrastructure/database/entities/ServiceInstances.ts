import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AiTransactionsLogs } from './AiTransactionsLogs';
import { Invoices } from './Invoices';
import { ServiceItems } from './ServiceItems';
import { ServicePlans } from './ServicePlans';
import { ServiceProperties } from './ServiceProperties';
import { Tickets } from './Tickets';
import { InfoLog } from './InfoLog';
import { ServiceTypes } from './ServiceTypes';
import { Tasks } from './Tasks';
console.log('service instances working');

@Index('index_zare_IsDeleted', ['isDeleted'], {})
@Index('PK_ServiceInstances', ['id'], { unique: true })
@Entity('ServiceInstances', { schema: 'user' })
export class ServiceInstances {
  @Column('uniqueidentifier', {
    primary: true,
    name: 'ID',
    default: () => 'newsequentialid()',
  })
  id: string;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('varchar', { name: 'ServiceTypeID', length: 50 })
  serviceTypeId: string;

  @Column('int', { name: 'Status', nullable: true })
  status: number | null;

  @Column('datetime', { name: 'CreateDate' })
  createDate: Date;

  @Column('datetime', { name: 'LastUpdateDate' })
  lastUpdateDate: Date;

  @Column('datetime', { name: 'ExpireDate', nullable: true })
  expireDate: Date | null;

  @Column('datetime', { name: 'DeletedDate', nullable: true })
  deletedDate: Date | null;

  @Column('bit', { name: 'IsDeleted', default: () => '(0)' })
  isDeleted: boolean;

  @Column('int', { name: 'Index', nullable: true })
  index: number | null;

  @Column('int', { name: 'WarningSent', nullable: true, default: () => '(0)' })
  warningSent: number | null;

  @Column('tinyint', {
    name: 'IsDisabled',
    nullable: true,
    default: () => '(0)',
  })
  isDisabled: boolean | null;

  @Column('nvarchar', { name: 'Name', nullable: true, length: 50 })
  name: string | null;

  @Column('float', { name: 'PlanRatio', nullable: true, precision: 53 })
  planRatio: number | null;

  @Column('datetime', { name: 'LastPAYG', nullable: true })
  lastPayg: Date | null;

  @Column('datetime', { name: 'NextPAYG', nullable: true })
  nextPayg: Date | null;

  @Column('tinyint', { name: 'ServicePlanType', nullable: true })
  servicePlanType: number | null;

  @Column('tinyint', {
    name: 'RetryCount',
    nullable: true,
    default: () => '(0)',
  })
  retryCount: number | null;

  @Column('nvarchar', { name: 'DatacenterName', nullable: true, length: 50 })
  datacenterName: string | null;

  @Column({
    name: 'DaysLeft',
    nullable: true,
    type: 'int',
    insert: false,
    readonly: true,
  })
  daysLeft: number | null;

  @Column('int', { name: 'Credit', nullable: true, default: () => '(0)' })
  credit: number | null;

  @Column('tinyint', { name: 'LastState', nullable: true })
  lastState: number | null;

  @Column('datetime', { name: 'Offset', nullable: true })
  offset: Date | null;

  @Column('bit', { name: 'AutoPaid', default: () => '(0)' })
  autoPaid: boolean;

  @OneToMany(
    () => AiTransactionsLogs,
    (aiTransactionsLogs) => aiTransactionsLogs.serviceInstance,
  )
  aiTransactionsLogs: AiTransactionsLogs[];

  @OneToMany(() => InfoLog, (infoLog) => infoLog.serviceInstance)
  infoLogs: InfoLog[];

  @OneToMany(() => Invoices, (invoices) => invoices.serviceInstance)
  invoices: Invoices[];

  @ManyToOne(
    () => ServiceTypes,
    (serviceTypes) => serviceTypes.serviceInstances,
  )
  @JoinColumn([{ name: 'ServiceTypeID', referencedColumnName: 'id' }])
  serviceType: ServiceTypes;

  // @OneToMany(() => ServiceItems, (serviceItems) => serviceItems.serviceInstance)
  // serviceItems: ServiceItems[];

  @OneToMany(() => ServicePlans, (servicePlans) => servicePlans.serviceInstance)
  servicePlans: ServicePlans[];

  @OneToMany(
    () => ServiceProperties,
    (serviceProperties) => serviceProperties.serviceInstance,
  )
  serviceProperties: ServiceProperties[];

  @OneToMany(() => Tasks, (tasks) => tasks.serviceInstance)
  tasks: Tasks[];

  @OneToMany(() => Tickets, (tickets) => tickets.serviceInstance)
  tickets: Tickets[];
}
