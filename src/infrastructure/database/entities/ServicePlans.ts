import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';

console.log('service plans working');

@Index('PK__ServiceP__3214EC279395D59C', ['id'], { unique: true })
@Entity('ServicePlans', { schema: 'user' })
export class ServicePlans {
  @Column('varchar', { name: 'PlanCode', length: 25 })
  planCode: string;

  @Column('float', { name: 'Ratio', precision: 53 })
  ratio: number;

  @Column('float', { name: 'Amount', precision: 53 })
  amount: number;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  // @ManyToOne(
  //   () => ServiceInstances,
  //   (serviceInstances) => serviceInstances.servicePlans,
  //   { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  // )
  // @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  // serviceInstance: ServiceInstances;
}
