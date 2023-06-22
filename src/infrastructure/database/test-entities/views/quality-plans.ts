import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceTypes } from '../ServiceTypes';

@Entity()
export class QualityPlans {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'text' }) // SQLite does not have a specific "string" type, so use "text" instead
  ServiceTypeID: string;

  @Column({ type: 'integer' }) // SQLite uses "integer" instead of "number" for whole numbers
  AdditionRatio: number;

  @Column({ type: 'real' }) // SQLite uses "real" instead of "number" for floating-point numbers
  AdditionAmount: number;

  @Column({ type: 'text' }) // Change "string" to "text" for SQLite compatibility
  Description: string;

  @Column({ type: 'text' }) // Change "string" to "text" for SQLite compatibility
  Code: string;

  @ManyToOne(() => ServiceTypes, { eager: true })
  @JoinColumn({ name: 'ServiceTypeID', referencedColumnName: 'id' })
  ServiceTypes: ServiceTypes;
}
