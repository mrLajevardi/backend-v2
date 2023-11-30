import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  VirtualColumn,
} from 'typeorm';
import { User } from './User';
import { Company } from './Company';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK__FileUplo__5A5B77D5FCFADAD5', ['pathLocator'], { unique: true })
@Index('UQ__FileUplo__9DD95BAF8426CD71', ['streamId'], { unique: true })
@Index('UQ__FileUplo__A236CBB31011B0DA', ['parentPathLocator', 'name'], {
  unique: true,
})
@Entity('FileUpload', { schema: 'dbo' })
export class FileUpload {
  @Column({
    type: isTestingEnv() ? 'nvarchar' : 'uniqueidentifier',
    name: 'stream_id',
    unique: true,
    default: () => 'newsequentialid()',
  })
  streamId: string;

  @Column({
    type: isTestingEnv() ? 'varchar' : 'varbinary',
    name: 'file_stream',
    nullable: true,
  })
  fileStream: Buffer | null;

  @Column('nvarchar', { name: 'name', unique: true, length: 255 })
  name: string;

  @Column({
    type: isTestingEnv() ? 'varchar' : 'hierarchyid',
    primary: true,
    name: 'path_locator',
    generated: !isTestingEnv(),
    default: () =>
      isTestingEnv()
        ? null
        : "convert(hierarchyid, '/' +     convert(varchar(20), convert(bigint, substring(convert(binary(16), newid()), 1, 6))) + '.' +     convert(varchar(20), convert(bigint, substring(convert(binary(16), newid()), 7, 6))) + '.' +     convert(varchar(20), convert(bigint, substring(convert(binary(16), newid()), 13, 4))) + '/')",
  })
  pathLocator: string;

  @Column({
    type: isTestingEnv() ? 'varchar' : 'hierarchyid',
    name: 'parent_path_locator',
    nullable: true,
    unique: true,
    generated: !isTestingEnv(),
  })
  parentPathLocator: string | null;

  @Column('nvarchar', {
    select: false,
    name: 'file_type',
    nullable: true,
    length: 255,
    generated: !isTestingEnv(),
  })
  fileType: string | null;

  @Column('bigint', {
    name: 'cached_file_size',
    nullable: true,
    generated: !isTestingEnv(),
  })
  cachedFileSize: string | null;

  @Column({
    type: isTestingEnv() ? 'datetime' : 'datetimeoffset',
    name: 'creation_time',
    default: () => 'sysdatetimeoffset()',
  })
  creationTime: Date;

  @Column({
    type: isTestingEnv() ? 'datetime' : 'datetimeoffset',
    name: 'last_write_time',
    default: () => 'sysdatetimeoffset()',
  })
  lastWriteTime: Date;

  @Column({
    type: isTestingEnv() ? 'datetime' : 'datetimeoffset',
    name: 'last_access_time',
    nullable: true,
    default: () => 'sysdatetimeoffset()',
  })
  lastAccessTime: Date | null;

  @Column({
    type: isTestingEnv() ? 'boolean' : 'bit',
    name: 'is_directory',
    default: () => '(0)',
  })
  isDirectory: boolean;

  @Column({
    type: isTestingEnv() ? 'boolean' : 'bit',
    name: 'is_offline',
    default: () => '(0)',
  })
  isOffline: boolean;

  @Column({
    type: isTestingEnv() ? 'boolean' : 'bit',
    name: 'is_hidden',
    default: () => '(0)',
  })
  isHidden: boolean;

  @Column({
    type: isTestingEnv() ? 'boolean' : 'bit',
    name: 'is_readonly',
    default: () => '(0)',
  })
  isReadonly: boolean;

  @Column({
    type: isTestingEnv() ? 'boolean' : 'bit',
    name: 'is_archive',
    default: () => '(1)',
  })
  isArchive: boolean;

  @Column({
    type: isTestingEnv() ? 'boolean' : 'bit',
    name: 'is_system',
    default: () => '(0)',
  })
  isSystem: boolean;

  @Column({
    type: isTestingEnv() ? 'boolean' : 'bit',
    name: 'is_temporary',
    default: () => '(0)',
  })
  isTemporary: boolean;

  @ManyToOne(() => FileUpload, (fileUpload) => fileUpload.fileUploads)
  @JoinColumn([
    { name: 'parent_path_locator', referencedColumnName: 'pathLocator' },
  ])
  parentPathLocator2: FileUpload;

  @OneToMany(() => FileUpload, (fileUpload) => fileUpload.parentPathLocator2)
  fileUploads: FileUpload[];

  @OneToOne(() => User, (user) => user.avatar)
  user: User;

  @OneToOne(() => Company, (company) => company.companyLogo)
  company: Company;
}
