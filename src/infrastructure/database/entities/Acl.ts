import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { isTestingEnv } from '../../helpers/helpers';
import { HookTypeEnum } from '../../../application/base/crud/acl-table/enum/hook-type.enum';
import { BaseEntity } from '../../entity/base.entity';
import { AccessType } from '../../../application/base/crud/acl-table/enum/access-type.enum';

@Index('PK__ACL__3213E83F35E40E26', ['id'], { unique: true })
@Entity('ACL', { schema: 'security' })
export class Acl extends BaseEntity {
  @Column('nvarchar', { name: 'Model', nullable: true, length: 255 })
  model: string | null;

  @Column('nvarchar', { name: 'Property', nullable: true, length: 255 })
  property: string | null;

  @Column('tinyint', { name: 'AccessType', nullable: true })
  accessType: AccessType;

  @Column(isTestingEnv() ? 'boolean' : 'bit', { name: 'Can', nullable: true })
  can: boolean;

  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'RoleId',
    nullable: true,
  })
  roleId: string;

  @Column(!isTestingEnv() ? 'tinyint' : 'tinyint', {
    name: 'HookType',
    nullable: true,
  })
  hookType: HookTypeEnum;
}
