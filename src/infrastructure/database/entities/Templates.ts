import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ServiceTypes } from './ServiceTypes';
import { Invoices } from './Invoices';
import { ServicePlanTypeEnum } from '../../../application/base/service/enum/service-plan-type.enum';

console.log('templates working');


@Index('PK__Template__A2B5777CA811BDD6', ['guid'], { unique: true })
@Entity('Templates', { schema: 'services' })
export class Templates {
  @Column('decimal', { name: 'ID', precision: 18, scale: 0 })
  id: number;

  @Column('datetime', { name: 'CreateDate', default: () => 'getdate()' })
  createDate: Date;

  @Column('datetime', { name: 'LastEditDate', default: () => 'getdate()' })
  lastEditDate: Date;

  @Column('decimal', { name: 'CreatorId', precision: 18, scale: 0 })
  creatorId: number;

  @Column('decimal', { name: 'LastEditorId', precision: 18, scale: 0 })
  lastEditorId: number;

  @Column('nvarchar', { name: 'Name', length: 50 })
  name: string;

  @Column('nvarchar', { name: 'Description', nullable: true, length: 150 })
  description: string | null;

  @Column('nvarchar', { name: 'Structure' })
  structure: string;

  @Column('bit', { name: 'Enabled', default: () => '(0)' })
  enabled: boolean;

  @Column('uniqueidentifier', {
    primary: true,
    name: 'Guid',
    default: () => 'newsequentialid()',
  })
  guid: string;

  @Column('tinyint', { name: 'ServicePlanType' })
  servicePlanType: ServicePlanTypeEnum;

  @Column('datetime', { name: 'ExpireDate' })
  expireDate: Date;

  @Column('bit', { name: 'IsDefault' })
  isDefault: boolean;

  @Column('int', { name: 'Period', nullable: true })
  period: number | null;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.templates)
  @JoinColumn([
    { name: 'ServiceTypeId', referencedColumnName: 'id' },
    { name: 'DatacenterName', referencedColumnName: 'datacenterName' },
  ])
  serviceType: ServiceTypes;

  @OneToMany(() => Invoices, (invoice) => invoice.templates)
  invoices: Invoices;
}
