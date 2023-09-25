import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceTypes } from '../ServiceTypes';
@Entity({
  schema: 'service',
  name: 'ServiceItemTypesTree',
})
export class ServiceItemTypesTree {
  @PrimaryColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'Code' })
  code: string;

  @Column({ name: 'DatacenterName' })
  fee: number;

  @Column({ name: 'ParentId' })
  parentId: number;

  @Column({ name: 'Title' })
  title: string;

  @Column({ name: 'Level' })
  level: number;

  @ManyToOne(() => ServiceTypes)
  @JoinColumn({ name: 'ServiceTypeID', referencedColumnName: 'id' })
  serviceTypes: ServiceTypes;
}
