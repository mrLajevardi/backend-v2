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
@Entity('RoleMapping', { schema: 'security' })
export class RoleMapping {
  @PrimaryGeneratedColumn()
  @Column('decimal', {
    name: 'Id',
    precision: 18,
    scale: 0,
  })
  id: number;

  @Column('decimal', {
    name: 'UserId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  userId: number | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @Column('datetime', { name: 'UpdateDate', nullable: true })
  updateDate: Date | null;

  @Column('decimal', {
    name: 'CreatorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  creatorId: number | null;

  @Column('decimal', {
    name: 'LastEditorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  lastEditorId: number | null;

  @Column('nvarchar', { name: 'IntegCode', nullable: true })
  integCode: string | null;

  @ManyToOne(() => Role, (role) => role.roleMappings)
  @JoinColumn([{ name: 'RoleId', referencedColumnName: 'guid' }])
  role: Role;
}
