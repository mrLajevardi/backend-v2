import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionGroups } from './PermissionGroups';
import { Role } from './Role';

@Index('PK__Permissi__3214EC270BC5F24C', ['id'], { unique: true })
@Entity('PermissionGroupsMappings', { schema: 'security' })
export class PermissionGroupsMappings {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @ManyToOne(
    () => PermissionGroups,
    (permissionGroups) => permissionGroups.permissionGroupsMappings,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'PermissionGroupID', referencedColumnName: 'id' }])
  permissionGroup: PermissionGroups;

  @ManyToOne(() => Role, (role) => role.permissionGroupsMappings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'RoleID', referencedColumnName: 'id' }])
  role: Role;
}
