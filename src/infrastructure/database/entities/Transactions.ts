import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Invoices } from './Invoices';
import { ServiceInstances } from './ServiceInstances';

@Index('PK_Transactions', ['id'], { unique: true })
@Entity('Transactions', { schema: 'user' })
export class Transactions {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @Column('int', { name: 'UserID' })
  userId: number;

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

  @Column('bit', { name: 'isApproved', nullable: true, default: () => "'0'" })
  isApproved: boolean | null;

  @Column('uniqueidentifier', { name: 'ServiceInstanceID', nullable: true })
  serviceInstanceId: string | null;

  @Column('nvarchar', { name: 'after', nullable: true, length: 65 })
  after: string | null;

  @Column('nvarchar', { name: 'before', nullable: true, length: 65 })
  before: string | null;

  @Column('decimal', { name: 'RefID', nullable: true, precision: 18, scale: 0 })
  refId: number | null;

  @Column('nvarchar', { name: 'MetaData', nullable: true })
  metaData: string | null;

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
