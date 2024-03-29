import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Groups } from './Groups';
import { User } from './User';

@Index('PK__GroupsMa__3214EC2799DAAC74', ['id'], { unique: true })
@Entity('GroupsMapping', { schema: 'security' })
export class GroupsMapping {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('datetime', { name: 'CreateDate' })
  createDate: Date;

  @Column('int', { name: 'UserID' })
  userId: number;

  @Column('int', { name: 'GroupID' })
  groupId: number;

  @ManyToOne(() => Groups, (groups) => groups.groupsMappings, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'GroupID', referencedColumnName: 'id' }])
  group: Groups;

  @ManyToOne(() => User, (user) => user.groupsMappings, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'UserID', referencedColumnName: 'id' }])
  user: User;
}
