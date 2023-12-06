import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity('EntityLog', { schema: 'logs' })
export class EntityLog {
  @PrimaryGeneratedColumn({
    name: 'Id',
  })
  id: number;

  @Column('nvarchar', { name: 'Before', nullable: true })
  before: string | null;

  @Column('nvarchar', { name: 'After', nullable: true })
  after: string | null;

  @Column('nvarchar', { name: 'Fields', nullable: true })
  fields: string | null;

  @Column('varchar', { name: 'EntityType', nullable: true, length: 50 })
  entityType: string | null;

  @Column('decimal', {
    name: 'EntityId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  entityId: number | null;

  @Column('decimal', {
    name: 'UserId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  userId: number | null;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  createDate: Date | null;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;
}
