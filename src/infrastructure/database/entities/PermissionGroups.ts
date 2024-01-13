import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionGroupsMappings } from './PermissionGroupsMappings';
import { PermissionMappings } from './PermissionMappings';
console.log('permission working');

@Index('PK__Permissi__3214EC2736890AFB', ['id'], { unique: true })
@Entity('PermissionGroups', { schema: 'security' })
export class PermissionGroups {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'Name', length: 50 })
  name: string;

  @Column('nvarchar', { name: 'Description', nullable: true })
  description: string | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @OneToMany(
    () => PermissionGroupsMappings,
    (permissionGroupsMappings) => permissionGroupsMappings.permissionGroup,
  )
  permissionGroupsMappings: PermissionGroupsMappings[];

  @OneToMany(
    () => PermissionMappings,
    (permissionMappings) => permissionMappings.permissionGroup,
  )
  permissionMappings: PermissionMappings[];
}
