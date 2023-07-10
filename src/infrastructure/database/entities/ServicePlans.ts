import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK_ServicePlans', ['id'], { unique: true })
@Entity('ServicePlans', { schema: 'user' })
export class ServicePlans {
  @Column('uniqueidentifier', { name: 'ServiceInstanceID' })
  serviceInstanceId: string;

  @Column('varchar', { name: 'PlanCode', length: 25 })
  planCode: string;

  @Column('float', { name: 'Ratio', precision: 53 })
  ratio: number;

  @Column('float', { name: 'Amount', precision: 53 })
  amount: number;

  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;
}
