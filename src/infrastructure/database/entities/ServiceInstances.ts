import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BeforeInsert, JoinColumn, ManyToOne } from 'typeorm';
import { AiTransactionsLogs } from './AiTransactionsLogs';
import { InfoLog } from './InfoLog';
import { Invoices } from './Invoices';
import { ServiceTypes } from './ServiceTypes';
import { ServiceItems } from './ServiceItems';
import { ServiceProperties } from './ServiceProperties';
import { Tasks } from './Tasks';
import { Tickets } from './Tickets';
import { randomUUID } from 'crypto';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { VmPowerStateEventEnum } from '../../../wrappers/main-wrapper/service/user/vm/enum/vm-power-state-event.enum';
@Index('index_zare_IsDeleted', ['isDeleted'], {})
@Index('PK_ServiceInstances', ['id'], { unique: true })
@Entity('ServiceInstances', { schema: 'services' })
export class ServiceInstances {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ID',
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

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'IsDeleted',
    default: () => '(0)',
  })
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

  @Column('nvarchar', {
    name: 'DatacenterName',
    nullable: true,
  })
  datacenterName: string | null;

  @Column('tinyint', {
    name: 'RetryCount',
    nullable: true,
    default: () => '(0)',
  })
  retryCount: number | null;

  credit?: number | null;

  @Column({
    name: 'DaysLeft',
    nullable: true,
    insert: false,
    readonly: true,
  })
  daysLeft: number | null;

  @Column({
    name: 'LastState',
    nullable: true,
  })
  lastState: VmPowerStateEventEnum | null;

  @Column({
    name: 'Offset',
    nullable: true,
  })
  offset: Date | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'AutoPaid',
    default: () => '(0)',
  })
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

  @OneToMany(() => ServiceItems, (serviceItems) => serviceItems.serviceInstance)
  serviceItems: ServiceItems[];

  // @OneToMany(() => ServicePlans, (servicePlans) => servicePlans.serviceInstance)
  // servicePlans: ServicePlans[];

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
