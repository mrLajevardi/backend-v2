import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
console.log('entity log working');

@Index('PK__EntityLo__3214EC07CC271E87', ['id'], { unique: true })
@Entity('EntityLog', { schema: 'logs' })
export class EntityLog {
  @PrimaryGeneratedColumn()
  @Column('decimal', {
    name: 'Id',
    precision: 18,
    scale: 0,
    primary: true,
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

  // @ManyToOne(() => User, (user) => user.entityLog)
  // @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  // user: User;
}
