import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Acl } from './Acl';
import { RoleMapping } from './RoleMapping';
console.log('role working');

@Index('PK_Role', ['guid'], { unique: true })
@Entity('Role', { schema: 'security' })
export class Role {
  @PrimaryGeneratedColumn()
  @Column('decimal', {
    name: 'Id',
    precision: 18,
    scale: 0,
  })
  id: number;

  @Column('nvarchar', { name: 'Name', length: 100 })
  name: string;

  @Column('nvarchar', { name: 'Description', nullable: true, length: 200 })
  description: string | null;

  @Column('datetime', { name: 'UpdateDate' })
  updateDate: Date;

  @Column('datetime', { name: 'CreateDate' })
  createDate: Date;

  @Column('uniqueidentifier', {
    primary: true,
    name: 'Guid',
    default: () => 'newsequentialid()',
  })
  guid: string;

  @Column('decimal', {
    name: 'LastEditorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  lastEditorId: number | null;

  @Column('nvarchar', { name: 'IntegCode', nullable: true })
  integCode: string | null;

  @OneToMany(() => Acl, (acl) => acl.role)
  acls: Acl[];

  @OneToMany(() => RoleMapping, (roleMapping) => roleMapping.role)
  roleMappings: RoleMapping[];
}
