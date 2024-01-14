import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';
import { VServiceInstances } from './views/v-serviceInstances';
import { ItemTypes } from './ItemTypes';
console.log('serviceItems working');

@Index('PK_ServiceResources', ['id'], { unique: true })
@Entity('ServiceItems', { schema: 'user' })
export class ServiceItems {
  @Column('int', { name: 'ItemTypeID' })
  itemTypeId: number;

  @Column('float', { name: 'Quantity', precision: 53 })
  quantity: number;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'ItemTypeCode', nullable: true, length: 50 })
  itemTypeCode: string | null;

  @Column('nvarchar', { name: 'Value', nullable: true, length: 50 })
  value: string | null;
  @Column('uniqueidentifier', {
    name: 'ServiceInstanceID',
  })
  serviceInstanceId: string;

  // @ManyToOne(
  //   () => ServiceInstances,
  //   (serviceInstances) => serviceInstances.serviceItems,
  //   { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  // )
  // @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  // serviceInstance: ServiceInstances;

  // @OneToMany(() => VServiceInstances, (vServiceInstance) => vServiceInstance.serviceInstance)
  // servicePlans: ServicePlans[];)
  // vServiceInstance: VServiceInstances;

  // @ManyToOne(() => ItemTypes, (itemTypes) => itemTypes.serviceItems, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'ItemTypeID', referencedColumnName: 'id' }])
  // itemType: ItemTypes;
}
