import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Configs } from './Configs';
import { Discounts } from './Discounts';
import { ItemTypes } from './ItemTypes';
import { Templates } from './Templates';
import { ServiceInstances } from './ServiceInstances';

@Index('PK_ServiceTypes', ['id'], { unique: true })
@Entity('ServiceTypes', { schema: 'services' })
export class ServiceTypes {
  @Column('varchar', { primary: true, name: 'ID', length: 50 })
  id: string;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('nvarchar', { name: 'DatacenterName', nullable: true, length: 50 })
  datacenterName: string | null;

  @Column('float', { name: 'BaseFee', precision: 53 })
  baseFee: number;

  @Column('varchar', { name: 'CreateInstanceScript', length: 255 })
  createInstanceScript: string;

  @Column('bit', { name: 'VerifyInstance' })
  verifyInstance: boolean;

  @Column('int', { name: 'MaxAvailable' })
  maxAvailable: number;

  @Column('tinyint', { name: 'Type', default: () => '(0)' })
  type: number;

  @Column('bit', { name: 'IsPAYG' })
  isPayg: boolean;

  @Column('time', { name: 'PAYGInterval', nullable: true })
  paygInterval: Date | null;

  @Column('varchar', { name: 'PAYGScript', nullable: true, length: 255 })
  paygScript: string | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @OneToMany(() => Configs, (configs) => configs.serviceType)
  configs: Configs[];

  @OneToMany(() => Discounts, (discounts) => discounts.serviceType)
  discounts: Discounts[];

  @OneToMany(() => ItemTypes, (itemTypes) => itemTypes.serviceType)
  itemTypes: ItemTypes[];

  @OneToMany(() => Templates, (templates) => templates.serviceType)
  templates: Templates[];

  @OneToMany(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.serviceType,
  )
  serviceInstances: ServiceInstances[];
}
