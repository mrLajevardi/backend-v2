import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Configs } from './Configs';
import { Discounts } from './Discounts';
import { ItemTypes } from './ItemTypes';
import { ServiceInstances } from './ServiceInstances';

@Index('PK_ServiceTypes', ['id'], { unique: true })
@Entity()
export class ServiceTypes {
  @Column('varchar', { primary: true, name: 'ID', length: 50 })
  id: string;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('float', { name: 'BaseFee', precision: 53 })
  baseFee: number;

  @Column('varchar', { name: 'CreateInstanceScript', length: 255 })
  createInstanceScript: string;

  @Column('boolean', { name: 'VerifyInstance' })
  verifyInstance: boolean;

  @Column('integer', { name: 'MaxAvailable' })
  maxAvailable: number;

  @Column('tinyint', { name: 'Type', default: () => '(0)' })
  type: number;

  @Column('boolean', { name: 'IsPAYG' })
  isPayg: boolean;

  @Column('time', { name: 'PAYGInterval', nullable: true })
  paygInterval: Date | null;

  @Column('varchar', { name: 'PAYGScript', nullable: true, length: 255 })
  paygScript: string | null;

  @OneToMany(() => Configs, (configs) => configs.serviceType)
  configs: Configs[];

  @OneToMany(() => Discounts, (discounts) => discounts.serviceType)
  discounts: Discounts[];

  @OneToMany(() => ItemTypes, (itemTypes) => itemTypes.serviceType)
  itemTypes: ItemTypes[];

  @OneToMany(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.serviceType,
  )
  serviceInstances: ServiceInstances[];
}
