import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ServiceTypes } from '../ServiceTypes';
import { isTestingEnv } from '../../../helpers/helpers';
import { ServicePlanTypeEnum } from '../../../../application/base/service/enum/service-plan-type.enum';
import { VmPowerStateEventEnum } from '../../../../wrappers/main-wrapper/service/user/vm/enum/vm-power-state-event.enum';
import { AiTransactionsLogs } from '../AiTransactionsLogs';
import { InfoLog } from '../InfoLog';
import { Invoices } from '../Invoices';
import { ServiceItems } from '../ServiceItems';
import { ServiceProperties } from '../ServiceProperties';
import { Tasks } from '../Tasks';
import { Tickets } from '../Tickets';
import { VServiceInstances } from './v-serviceInstances';

@Entity({
  name: 'V_ServiceDetail',
})
export class VServiceInstanceDetail {
  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'ServiceInstanceId',
  })
  serviceInstanceId: string | null;
  @Column('nvarchar', { name: 'value', nullable: false, length: 50 })
  value: string | null;

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
  })
  createDate: Date | null;

  @Column('int', { name: 'Percent', nullable: true })
  percent: number | null;

  @Column('tinyint', { name: 'PrinciplePrice', nullable: true })
  principlePrice: number | null;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.itemTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ServiceTypeID', referencedColumnName: 'id' }])
  serviceType: ServiceTypes;

  @Column('varchar', { name: 'ServiceTypeID', length: 50 })
  serviceTypeId: string;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'Required',
    nullable: true,
  })
  required: boolean | null;
  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'Enabled',
    nullable: true,
  })
  enabled: boolean | null;

  @Column('int', { name: 'Step', nullable: true })
  step: number | null;

  @Column({ name: 'Level' })
  level: number;

  @Column('nvarchar', { name: 'Hierarchy', nullable: true, length: 50 })
  hierarchy: string;

  @Column('tinyint', { name: 'ServicePlanType', nullable: false })
  ServicePlanType: ServicePlanTypeEnum;

  @Column('nvarchar', { name: 'CodeHierarchy', nullable: true, length: 150 })
  codeHierarchy: string;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'IsDeleted',
    nullable: false,
  })
  isDeleted: boolean;

  @ManyToOne(() => ServiceTypes)
  @JoinColumn({ name: 'ServiceTypeID', referencedColumnName: 'id' })
  serviceTypes: ServiceTypes;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('int', { name: 'Status', nullable: true })
  status: number | null;

  @Column('datetime', { name: 'LastUpdateDate' })
  lastUpdateDate: Date;

  @Column('datetime', { name: 'ExpireDate', nullable: true })
  expireDate: Date | null;

  @Column('datetime', { name: 'DeletedDate', nullable: true })
  deletedDate: Date | null;

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
  })
  daysLeft: number | null;

  @Column({ type: 'int', name: 'ServiceItemID', primary: true })
  serviceItemId: number;

  @Column({ name: 'ItemTypeID' })
  itemTypeId: number;

  // @Column({
  //   name: 'Offset',
  //   nullable: true,
  // })
  // offset: Date | null;

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

  @ManyToOne(
    () => VServiceInstances,
    (vServiceInstances) => vServiceInstances.vServiceItems,
  )
  @JoinColumn([
    {
      name: isTestingEnv() ? 'serviceInstanceId2' : 'serviceInstanceId',
      referencedColumnName: 'id',
    },
  ])
  vServiceInstance: VServiceInstances;
}
