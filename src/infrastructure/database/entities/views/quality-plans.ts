import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceTypes } from '../ServiceTypes';
@Entity()
export class QualityPlans {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'string' })
  ServiceTypeID: string;

  @Column({ type: 'number' })
  AdditionRatio: number;

  @Column({ type: 'number' })
  AdditionAmount: number;

  @Column({ type: 'string' })
  Description: string;

  @Column({ type: 'string' })
  Code: string;

  @ManyToOne(() => ServiceTypes, { eager: true })
  @JoinColumn({ name: 'ServiceTypeID', referencedColumnName: 'ID' })
  ServiceTypes: ServiceTypes;
}
