import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK_Files', ['guid'], { unique: true })
@Entity('Files', { schema: 'system' })
export class Files {
  @Column({
    type: isTestingEnv() ? 'nvarchar' : 'uniqueidentifier',
    primary: true,
    name: 'Guid',
    default: () => 'newsequentialid()',
  })
  guid: string;

  @Column('decimal', {
    name: 'Id',
    precision: 18,
    scale: 0,
    primary: true,
    generated: !isTestingEnv(),
  })
  id: number;

  @Column({
    type: isTestingEnv() ? 'varchar' : 'varbinary',
    name: 'FileStream',
    nullable: true,
  })
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

  // @OneToOne(() => User, (user) => user.avatar)
  // user: User;
}
