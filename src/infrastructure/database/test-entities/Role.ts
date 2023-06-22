import { Column, Entity, Index, OneToMany } from 'typeorm';
import { PermissionGroupsMappings } from './PermissionGroupsMappings';
import { RoleMapping } from './RoleMapping';

@Index('PK__Role__3213E83F33C5C466', ['id'], { unique: true })
@Entity()
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
    default: () => 'getdate()',
  })
  created: Date | null;

  @Column('datetime', {
    name: 'modified',
    nullable: true,
    default: () => 'getdate()',
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
