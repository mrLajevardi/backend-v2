import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './Role';
import { BaseEntity } from '../../entity/base.entity';
import { HookTypeEnum } from '../../../application/base/crud/acl-table/enum/hook-type.enum';
import { AccessType } from '../../../application/base/crud/acl-table/enum/access-type.enum';
console.log('im here Acl');

@Index('PK__ACL__3213E83F4E95AFC9', ['guid'], { unique: true })
@Entity('ACL', { schema: 'security' })
export class Acl extends BaseEntity {
  @Column('nvarchar', { name: 'Model', nullable: true, length: 100 })
  model: string | null;

  @Column('nvarchar', { name: 'Property', nullable: true })
  property: string | null;

  @Column('tinyint', { name: 'AccessType', nullable: true })
  accessType: AccessType | null;

  @Column('bit', { name: 'Can', nullable: true })
  can: boolean | null;

  @Column('datetime', { name: 'CreateDate' })
  createDate: Date;

  @Column('datetime', { name: 'UpdateDate' })
  updateDate: Date;

  @Column('decimal', { name: 'CreatorId', precision: 18, scale: 0 })
  creatorId: number;

  @Column('decimal', { name: 'LastEditorId', precision: 18, scale: 0 })
  lastEditorId: number;

  @Column('nvarchar', { name: 'IntegCode', nullable: true })
  integCode: string | null;

  @Column('tinyint', { name: 'HookType' })
  hookType: HookTypeEnum;

  @Column('uniqueidentifier', {
    name: 'RoleId',
    nullable: true,
  })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.acls, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'RoleId', referencedColumnName: 'guid' }])
  role: Role;
}
