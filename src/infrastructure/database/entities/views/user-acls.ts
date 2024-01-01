import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../entity/base.entity';
import { HookTypeEnum } from '../../../../application/base/crud/acl-table/enum/hook-type.enum';
import { AccessType } from '../../../../application/base/crud/acl-table/enum/access-type.enum';

@Entity({
  schema: 'security',
  name: 'UserAcls',
})
export class UserAcls extends BaseEntity {
  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('nvarchar', { name: 'Model', nullable: true, length: 255 })
  model: string | null;

  @Column('nvarchar', { name: 'Property', nullable: true, length: 255 })
  property: string | null;

  @Column('tinyint', { name: 'AccessType', nullable: true })
  accessType: AccessType;

  @Column(isTestingEnv() ? 'boolean' : 'bit', { name: 'Can' })
  can: boolean;

  @Column(isTestingEnv() ? 'text' : 'uniqueidentifier', {
    name: 'RoleId',
    nullable: true,
  })
  roleId: string;

  @Column(!isTestingEnv() ? 'tinyint' : 'tinyint', {
    name: 'HookType',
    nullable: false,
  })
  hookType: HookTypeEnum;
}
