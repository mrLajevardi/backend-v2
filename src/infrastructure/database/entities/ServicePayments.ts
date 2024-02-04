import { BeforeInsert, Column, Entity } from 'typeorm';
import { randomUUID } from 'crypto';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Entity('ServicePayments', { schema: 'services' })
export class ServicePayments {
  @Column({
    type: isTestingEnv() ? 'nvarchar' : 'uniqueidentifier',
    name: 'Id',
    nullable: true,
    primary: true,
  })
  id: string | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @Column('decimal', {
    name: 'CreateUserId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  createUserId: number | null;

  @Column('datetime', { name: 'LastEditDate', nullable: true })
  lastEditDate: Date | null;

  @Column('datetime', { name: 'LastEditorId', nullable: true })
  lastEditorId: Date | null;

  @Column('nvarchar', { name: 'IntegCode', nullable: true })
  integCode: string | null;

  @Column('tinyint', { name: 'PaymentType', nullable: true })
  paymentType: number | null;

  @Column('int', { name: 'UserId', nullable: true })
  userId: number | null;

  @Column('int', { name: 'InvoiceId', nullable: true })
  invoiceId: number | null;

  @Column({
    type: isTestingEnv() ? 'nvarchar' : 'uniqueidentifier',
    name: 'ServiceInstanceId',
    nullable: true,
  })
  serviceInstanceId: string | null;

  @Column('decimal', { name: 'Price', nullable: true, precision: 18, scale: 0 })
  price: number | null;

  @Column('tinyint', { name: 'TaxPercent', nullable: true })
  taxPercent: number | null;

  @Column('nvarchar', { name: 'MetaData', nullable: true })
  metaData: string;

  @BeforeInsert()
  setId() {
    this.id = randomUUID();
  }
}
