import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sessions } from './Sessions';
import { User } from './User';
console.log('organization working');

@Index('PK__organiza__3213E83F513E7650', ['id'], { unique: true })
@Entity('Organization', { schema: 'vdc' })
export class Organization {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('nvarchar', { name: 'name', length: 50 })
  name: string;

  @Column('text', { name: 'dsc', nullable: true })
  dsc: string | null;

  @Column('nvarchar', { name: 'orgId', nullable: true })
  orgId: string | null;

  @Column('datetime', { name: 'createDate', nullable: true })
  createDate: Date | null;

  @Column('datetime', { name: 'updateDate', nullable: true })
  updateDate: Date | null;

  @Column('int', { name: 'userId' })
  userId: number;

  // @ManyToOne(() => User, (user) => user.organizations, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  // user: User;

  // @OneToMany(() => Sessions, (sessions) => sessions.org)
  // sessions: Sessions[];
}
