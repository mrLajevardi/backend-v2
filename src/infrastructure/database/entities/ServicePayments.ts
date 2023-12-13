import { Column, Entity } from 'typeorm';

@Entity('ServicePayments', { schema: 'dbo' })
export class ServicePayments {
  @Column('uniqueidentifier', { name: 'Id', nullable: true, primary: true })
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

  @Column('uniqueidentifier', { name: 'ServiceInstanceId', nullable: true })
  serviceInstanceId: string | null;

  @Column('decimal', { name: 'Price', nullable: true, precision: 18, scale: 0 })
  price: number | null;
}
