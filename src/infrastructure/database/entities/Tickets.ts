import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceInstances } from './ServiceInstances';
console.log('tickets working');

@Index('PK__Tickets__3214EC2736EDC157', ['id'], { unique: true })
@Entity('Tickets', { schema: 'user' })
export class Tickets {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('int', { name: 'TicketID' })
  ticketId: number;

  // @ManyToOne(
  //   () => ServiceInstances,
  //   (serviceInstances) => serviceInstances.tickets,
  // )
  // @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  // serviceInstance: ServiceInstances;
}
