import { Column, Entity, Index, OneToMany } from 'typeorm';
import { PermissionGroupsMappings } from './PermissionGroupsMappings';
import { RoleMapping } from './RoleMapping';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK__Role__3213E83F33C5C466', ['id'], { unique: true })
@Entity('Role', { schema: 'security' })
export class Role {
  @Column('nvarchar', { primary: true, name: 'id', length: 50 })
  id: string;

  @Column('nvarchar', { name: 'name', length: 255 })
  name: string;

  @Column('nvarchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @Column('datetime', {
    name: 'created',
    nullable: true,
    default: () => isTestingEnv() ? 'CURRENT_TIMESTAMP' : 'getdate()',
  })
  created: Date | null;

  @Column('datetime', {
    name: 'modified',
    nullable: true,
    default: () => isTestingEnv() ? 'CURRENT_TIMESTAMP' : 'getdate()',
  })
  modified: Date | null;

  @OneToMany(
    () => PermissionGroupsMappings,
    (permissionGroupsMappings) => permissionGroupsMappings.role,
  )
  permissionGroupsMappings: PermissionGroupsMappings[];

  @OneToMany(() => RoleMapping, (roleMapping) => roleMapping.role)
  roleMappings: RoleMapping[];
}
