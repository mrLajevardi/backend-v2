import { Column, Entity, Index } from 'typeorm';

@Index('PK__Notifica__3214EC07FBA37F19', ['id'], { unique: true })
@Entity('Notification', { schema: 'user' })
export class Notification {
  @Column('uniqueidentifier', { primary: true, name: 'Id' })
  id: string;

  @Column('nvarchar', { name: 'Title', nullable: true, length: 255 })
  title: string | null;

  @Column('nvarchar', { name: 'Description', nullable: true })
  description: string | null;

  @Column('nvarchar', { name: 'Url', nullable: true, length: 255 })
  url: string | null;

  @Column('nvarchar', { name: 'Thumbnail', nullable: true, length: 255 })
  thumbnail: string | null;

  @Column('nvarchar', { name: 'MetaData', nullable: true })
  metaData: string | null;

  @Column('datetime', { name: 'ExpireDate', nullable: true })
  expireDate: Date | null;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  createDate: Date | null;

  @Column('decimal', {
    name: 'UserId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  userId: number | null;

  @Column('datetime', { name: 'SeenDate', nullable: true })
  seenDate: Date | null;

  @Column('tinyint', { name: 'NotificationType', nullable: true })
  notificationType: number | null;

  @Column('nvarchar', { name: 'Event', nullable: true, length: 20 })
  event: string | null;
}
