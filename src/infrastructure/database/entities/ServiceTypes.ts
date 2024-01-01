import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Configs } from './Configs';
import { Discounts } from './Discounts';
import { ItemTypes } from './ItemTypes';
import { Templates } from './Templates';
import { ServiceInstances } from './ServiceInstances';
import { isTestingEnv } from '../../helpers/helpers';

@Index('PK_ServiceTypes', ['id', 'datacenterName'], { unique: true })
@Entity('ServiceTypes', { schema: 'services' })
export class ServiceTypes {
  @Column('varchar', { primary: true, name: 'ID', length: 50 })
  id: string;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('nvarchar', {
    primary: true,
    name: 'DatacenterName',
    nullable: true,
    length: 50,
  })
  datacenterName: string | null;

  @Column('float', { name: 'BaseFee', precision: 53 })
  baseFee: number;

  @Column('varchar', { name: 'CreateInstanceScript', length: 255 })
  createInstanceScript: string;

  @Column(isTestingEnv() ? 'boolean' : 'bit', { name: 'VerifyInstance' })
  verifyInstance: boolean;

  @Column('int', { name: 'MaxAvailable' })
  maxAvailable: number;

  @Column('tinyint', { name: 'Type', default: () => '(0)' })
  type: number;

  @Column(isTestingEnv() ? 'boolean' : 'bit', { name: 'IsPAYG' })
  isPayg: boolean;

  @Column('time', { name: 'PAYGInterval', nullable: true })
  paygInterval: Date | null;

  @Column('varchar', { name: 'PAYGScript', nullable: true, length: 255 })
  paygScript: string | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @OneToMany(() => Configs, (configs) => configs.serviceTypes)
  configs: Configs[];

  @OneToMany(() => Discounts, (discounts) => discounts.serviceTypes)
  discounts: Discounts[];

  @OneToMany(() => ItemTypes, (itemTypes) => itemTypes.serviceTypes)
  itemTypes: ItemTypes[];

  @OneToMany(() => Templates, (templates) => templates.serviceType)
  templates: Templates[];

  @OneToMany(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.serviceType,
  )
  serviceInstances: ServiceInstances[];
}
