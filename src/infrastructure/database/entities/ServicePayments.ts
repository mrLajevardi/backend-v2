import { Column, Entity, Index } from 'typeorm';

@Index('PK_ServicePayments', ['id'], { unique: true })
@Entity('ServicePayments', { schema: 'dbo' })
export class ServicePayments {
  @Column('uniqueidentifier', { primary: true, name: 'Id' })
  id: string;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    default: () => 'getdate()',
  })
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

  @Column('uniqueidentifier', { name: 'ServiceInstanceId', nullable: true })
  serviceInstanceId: string | null;

  @Column('decimal', { name: 'Price', nullable: true, precision: 18, scale: 0 })
  price: number | null;

  @Column('nvarchar', { name: 'MetaData', nullable: true })
  metaData: string | null;

  @Column('tinyint', { name: 'TaxPercent', nullable: true })
  taxPercent: number | null;
}
