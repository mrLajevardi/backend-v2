import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Configs } from './Configs';
import { Discounts } from './Discounts';
import { ItemTypes } from './ItemTypes';
import { Templates } from './Templates';
import { ServiceInstances } from './ServiceInstances';
console.log('serviceTypes working');

@Index('PK_ServiceTypes', ['id', 'datacenterName'], { unique: true })
@Entity('ServiceTypes', { schema: 'services' })
export class ServiceTypes {
  @Column('varchar', { primary: true, name: 'ID', length: 50 })
  id: string;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('nvarchar', { primary: true, name: 'DatacenterName', length: 50 })
  datacenterName: string;

  @Column('float', { name: 'BaseFee', nullable: true, precision: 53 })
  baseFee: number | null;

  @Column('varchar', {
    name: 'CreateInstanceScript',
    nullable: true,
    length: 255,
  })
  createInstanceScript: string | null;

  @Column('bit', { name: 'VerifyInstance', nullable: true })
  verifyInstance: boolean | null;

  @Column('int', { name: 'MaxAvailable', nullable: true })
  maxAvailable: number | null;

  @Column('tinyint', { name: 'Type', nullable: true, default: () => '(0)' })
  type: number | null;

  @Column('bit', { name: 'IsPAYG', nullable: true })
  isPayg: boolean | null;

  @Column('time', { name: 'PAYGInterval', nullable: true })
  paygInterval: Date | null;

  @Column('varchar', { name: 'PAYGScript', nullable: true, length: 255 })
  paygScript: string | null;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  createDate: Date | null;

  // @OneToMany(() => Configs, (configs) => configs.serviceTypes)
  // configs: Configs[];

  // @OneToMany(() => Discounts, (discounts) => discounts.serviceTypes)
  // discounts: Discounts[];

  // @OneToMany(() => ItemTypes, (itemTypes) => itemTypes.serviceType)
  // itemTypes: ItemTypes[];

  // @OneToMany(() => Templates, (templates) => templates.serviceType)
  // templates: Templates[];

  // @OneToMany(
  //   () => ServiceInstances,
  //   (serviceInstances) => serviceInstances.serviceType,
  // )
  // serviceInstances: ServiceInstances[];
}
