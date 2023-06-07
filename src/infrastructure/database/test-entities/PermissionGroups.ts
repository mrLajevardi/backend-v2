import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionGroupsMappings } from './PermissionGroupsMappings';
import { PermissionMappings } from './PermissionMappings';

@Index('PK__Permissi__3214EC2736890AFB', ['id'], { unique: true })
@Entity()
export class PermissionGroups {
  @PrimaryGeneratedColumn({ type: 'integer' })
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
