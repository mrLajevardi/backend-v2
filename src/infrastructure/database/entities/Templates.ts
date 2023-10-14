import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ServiceTypes } from './ServiceTypes';
import { InvoiceTypes } from 'src/application/base/invoice/enum/invoice-type.enum';

@Entity('Templates', { schema: 'services' })
export class Templates {
  @PrimaryColumn('decimal', { name: 'ID', precision: 18, scale: 0 })
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

  @Column('nvarchar', { name: 'DatacenterName', nullable: true, length: 50 })
  datacenterName: string | null;

  @Column('uniqueidentifier', {
    name: 'Guid',
    default: () => 'newsequentialid()',
  })
  guid: string;

  @Column('tinyint', { name: 'ServicePlanType' })
  servicePlanType: InvoiceTypes;

  @Column('datetime', { name: 'ExpireDate' })
  expireDate: Date;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.templates)
  @JoinColumn([{ name: 'ServiceTypeId', referencedColumnName: 'id' }])
  serviceType: ServiceTypes;
}
