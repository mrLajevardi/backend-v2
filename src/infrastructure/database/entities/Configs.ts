import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceTypes } from './ServiceTypes';

@Index('PK_Configs', ['id'], { unique: true })
// @Index('PK_services.Config', ['id'], { unique: true })
@Entity('Configs', { schema: 'security' })
export class Configs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'PropertyKey', length: 50 })
  propertyKey: string;

  @Column('varchar', { name: 'Value', length: 100 })
  value: string;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.configs)
  @JoinColumn([
    { name: 'ServiceTypeID', referencedColumnName: 'id' },
    { name: 'DatacenterName', referencedColumnName: 'datacenterName' },
  ])
  serviceTypes: ServiceTypes;
  @Column('varchar', { name: 'ServiceTypeID' })
  serviceTypeId: string;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.configs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'ServiceTypeID', referencedColumnName: 'id' },
    { name: 'DatacenterName', referencedColumnName: 'datacenterName' },
  ])
  serviceType: ServiceTypes;
}
