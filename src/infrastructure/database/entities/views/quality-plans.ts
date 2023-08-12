import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceTypes } from '../ServiceTypes';
@Entity()
export class QualityPlans {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ type: 'string', name: 'ServiceTypeID' })
  serviceTypeId: string;

  @Column({ type: 'int', name: 'AdditionRatio' })
  additionRatio: number;

  @Column({ type: 'int', name: 'AdditionAmount' })
  additionAmount: number;

  @Column({ type: 'nvarchar', name: 'Description' })
  description: string;

  @Column({ type: 'nvarchar', name: 'Code' })
  code: string;

  @ManyToOne(() => ServiceTypes, { eager: true })
  @JoinColumn({ name: 'ServiceTypeID', referencedColumnName: 'id' })
  serviceTypes: ServiceTypes;
}
