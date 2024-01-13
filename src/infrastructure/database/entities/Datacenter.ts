import { Column, Entity } from 'typeorm';

@Entity('Datacenter', { schema: 'dbo' })
export class Datacenter {
  @Column('uniqueidentifier', { name: 'Guid', nullable: true })
  guid: string | null;

  @Column('nvarchar', { name: 'Url', nullable: true, length: 150 })
  url: string | null;

  @Column('nvarchar', { name: 'Password', nullable: true })
  password: string | null;

  @Column('nvarchar', { name: 'Username', nullable: true, length: 50 })
  username: string | null;

  @Column('bit', { name: 'Enabled', nullable: true })
  enabled: boolean | null;

  @Column('decimal', { name: 'Id', nullable: true, precision: 18, scale: 0 })
  id: number | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @Column('decimal', {
    name: 'CreatorId',
    nullable: true,
    precision: 18,
    scale: 0,
    primary: true,
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
