import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../entity/base.entity';

@Index('PK__ServiceD__3214EC07E8961BAC', ['id'], { unique: true })
@Entity('ServiceDiscount', { schema: 'services' })
export class ServiceDiscount extends BaseEntity {
  @Column('uniqueidentifier', { name: 'ServiceInstanceId', nullable: true })
  serviceInstanceId: string | null;

  @Column('float', { name: 'Percent', nullable: true, precision: 53 })
  percent: number | null;

  @Column('float', { name: 'Price', nullable: true, precision: 53 })
  price: number | null;

  @Column('int', { name: 'Duration', nullable: true })
  duration: number | null;

  @Column('datetime', { name: 'ActivateDate', nullable: true })
  activateDate: Date | null;

  @Column('bit', { name: 'Enabled', nullable: true, default: () => '(1)' })
  enabled: boolean | null;

  @Column('bit', { name: 'Deleted', nullable: true, default: () => '(0)' })
  deleted: boolean | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @Column('decimal', {
    name: 'CreatorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  creatorId: number | null;

  @Column('datetime', { name: 'LastEditDate', nullable: true })
  lastEditDate: Date | null;

  @Column('decimal', {
    name: 'LastEditorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  lastEditorId: number | null;

  @Column('nvarchar', { name: 'IntegCode', nullable: true })
  integCode: string | null;
}
