import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Invoices } from './Invoices';
import { ServiceInstances } from './ServiceInstances';

@Index('PK_Transactions', ['id'], { unique: true })
@Entity('Transactions', { schema: 'financial' })
export class Transactions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'ID' })
  id: string;

  @Column({
    type: 'uniqueidentifier',
    name: 'Guid',
    unique: true,
    generated: true,
  })
  guid: string;

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

  @Column('nvarchar', { name: 'PaymentGatewayType', nullable: true })
  paymentGatewayType: string;

  @Column('nvarchar', {
    name: 'PaymentToken',
    nullable: true,
    length: 255,
    default: () => "''",
  })
  paymentToken: string | null;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('decimal', { name: 'RefID', nullable: true })
  refId: number | null;

  @Column('nvarchar', { name: 'MetaData', nullable: true })
  metaData: string | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'isApproved',
    default: () => "'0'",
  })
  isApproved: boolean;

  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'ServiceInstanceID',
    nullable: true,
  })
  serviceInstanceId: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserID', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Invoices)
  @JoinColumn([{ name: 'InvoiceID', referencedColumnName: 'id' }])
  invoice: Invoices;

  @ManyToOne(() => ServiceInstances)
  @JoinColumn([{ name: 'ServiceInstanceID', referencedColumnName: 'id' }])
  serviceInstance: ServiceInstances;
}
