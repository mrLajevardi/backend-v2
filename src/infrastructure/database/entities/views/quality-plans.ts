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
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'string' })
  ServiceTypeID: string;

  @Column({ type: 'int' })
  AdditionRatio: number;

  @Column({ type: 'int' })
  AdditionAmount: number;

  @Column({ type: 'nvarchar' })
  Description: string;

  @Column({ type: 'nvarchar' })
  Code: string;

  @ManyToOne(() => ServiceTypes, { eager: true })
  @JoinColumn({ name: 'ServiceTypeID', referencedColumnName: 'id' })
  ServiceTypes: ServiceTypes;
}
