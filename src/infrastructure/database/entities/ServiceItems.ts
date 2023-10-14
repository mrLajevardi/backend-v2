import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';
import { ItemTypes } from './ItemTypes';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK_ServiceResources', ['id'], { unique: true })
@Entity('ServiceItems', { schema: 'user' })
export class ServiceItems {
  @Column('float', { name: 'Quantity', precision: 53 })
  quantity: number;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'ItemTypeCode', nullable: true, length: 50 })
  itemTypeCode: string | null;

  @Column('nvarchar', { name: 'Value', nullable: false, length: 50 })
  value: string;

  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'ServiceInstanceID',
  })
  serviceInstanceId: string;

  @Column('int', { name: 'ItemTypeID' })
  itemTypeId: number;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.serviceItems,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  serviceInstance: ServiceInstances;

  @ManyToOne(() => ItemTypes, (itemTypes) => itemTypes.serviceItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ItemTypeID', referencedColumnName: 'id' }])
  itemType: ItemTypes;
}
