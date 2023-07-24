import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index('PK_Transactions', ['id'], { unique: true })
@Entity('Transactions', { schema: 'user' })
export class Transactions {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @Column('datetime', { name: 'DateTime' })
  dateTime: Date;

  @Column('float', { name: 'Value', precision: 53 })
  value: number;

  @Column('int', { name: 'InvoiceID', nullable: true })
  invoiceId: number | null;

  @Column('nchar', { name: 'Description', nullable: true, length: 10 })
  description: string | null;

  @Column('int', { name: 'PaymentType', default: () => "'0'" })
  paymentType: number;

  @Column('nvarchar', {
    name: 'PaymentToken',
    nullable: true,
    length: 255,
    default: () => "''",
  })
  paymentToken: string | null;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('bit', { name: 'isApproved', default: () => "'0'" })
  isApproved: boolean;

  @Column('uniqueidentifier', { name: 'ServiceInstanceID', nullable: true })
  serviceInstanceId: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserID', referencedColumnName: 'id' }])
  user: User;
}
