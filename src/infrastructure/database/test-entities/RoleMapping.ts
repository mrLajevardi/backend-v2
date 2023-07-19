import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role';

@Index('PK__RoleMapp__3213E83F75DAA2FC', ['id'], { unique: true })
@Index('principalId_NONCLUSTERED_ASC_idx', ['principalId'], {})
@Entity()
export class RoleMapping {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('nvarchar', { name: 'principalType', nullable: true, length: 255 })
  principalType: string | null;

  @Column('nvarchar', { name: 'principalId', nullable: true, length: 255 })
  principalId: string | null;

  @Column('string', { name: 'RoleID' })
  roleId: string;
  
  @ManyToOne(() => Role, (role) => role.roleMappings, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
  role: Role;
}
