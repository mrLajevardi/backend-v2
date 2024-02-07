import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK__Tickets__3214EC2736EDC157', ['id'], { unique: true })
@Entity('Tickets', { schema: 'user' })
export class Tickets {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('int', { name: 'TicketID' })
  ticketId: number;

  @PrimaryGeneratedColumn({ name: 'Code', type: 'decimal' })
  code: number;

  @Column('tinyint', { name: 'Topic' })
  topic: number;

  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'ServiceInstanceID',
    nullable: true,
  })
  serviceInstanceId: string | null;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.tickets,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  serviceInstance: ServiceInstances;
}
