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

@Index('PK_ServiceResources', ['id'], { unique: true })
@Entity()
export class ServiceItems {
  @Column('float', { name: 'Quantity', precision: 53 })
  quantity: number;

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('varchar', { name: 'ItemTypeCode', nullable: true, length: 50 })
  itemTypeCode: string | null;

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
