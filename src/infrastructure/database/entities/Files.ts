import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK_Files', ['guid'], { unique: true })
@Entity('Files', { schema: 'dbo' })
export class Files {
  @Column('uniqueidentifier', {
    primary: true,
    name: 'Guid',
    default: () => 'newsequentialid()',
  })
  guid: string;

  @PrimaryGeneratedColumn()
  @Column({
    type: 'decimal',
    name: 'Id',
    precision: 18,
    scale: 0,
  })
  id: number;

  @Column('varbinary', { name: 'FileStream', nullable: true })
  fileStream: Buffer | null;

  @Column('nvarchar', { name: 'FileType', nullable: true, length: 50 })
  fileType: string | null;

  @Column('nvarchar', { name: 'FileName', nullable: true })
  fileName: string | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @Column('datetime', { name: 'LastEditDate', nullable: true })
  lastEditDate: Date | null;

  @Column('decimal', {
    name: 'CreatorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  creatorId: number | null;

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
