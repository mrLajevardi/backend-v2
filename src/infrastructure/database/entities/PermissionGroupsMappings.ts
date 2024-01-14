import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionGroups } from './PermissionGroups';
console.log('permission groups working');

@Index('PK__Permissi__3214EC270BC5F24C', ['id'], { unique: true })
@Entity('PermissionGroupsMappings', { schema: 'security' })
export class PermissionGroupsMappings {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'RoleID', length: 50 })
  roleId: string;

  // @ManyToOne(
  //   () => PermissionGroups,
  //   (permissionGroups) => permissionGroups.permissionGroupsMappings,
  //   { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  // )
  // @JoinColumn([{ name: 'PermissionGroupID', referencedColumnName: 'id' }])
  // permissionGroup: PermissionGroups;
}
