import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionMappings } from './PermissionMappings';

@Index('PK__Permissi__3214EC277F822875', ['id'], { unique: true })
@Entity()
export class Permissions {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('nvarchar', { name: 'Name', length: 50 })
  name: string;

  @Column('nvarchar', { name: 'Description', nullable: true })
  description: string | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @OneToMany(
    () => PermissionMappings,
    (permissionMappings) => permissionMappings.permission,
  )
  permissionMappings: PermissionMappings[];
}
