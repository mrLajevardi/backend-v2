import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK_ServicePlans', ['id'], { unique: true })
@Entity()
export class ServicePlans {
  @Column('text', { name: 'ServiceInstanceID' })
  serviceInstanceId: string;

  @Column('varchar', { name: 'PlanCode', length: 25 })
  planCode: string;

  @Column('float', { name: 'Ratio', precision: 53 })
  ratio: number;

  @Column('float', { name: 'Amount', precision: 53 })
  amount: number;

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;
}
