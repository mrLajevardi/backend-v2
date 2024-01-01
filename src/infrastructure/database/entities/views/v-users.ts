import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

// @Index('index_zare_IsDeleted', ['isDeleted'], {})
// @Index('PK_ServiceInstances', ['id'], { unique: true })
@Entity('V_Users', { schema: 'security' })
export class VUsers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('nvarchar', { name: 'username', length: 255 })
  username: string;

  @Column('nvarchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'active',
    default: () => '(1)',
  })
  active: boolean;

  @Column('nvarchar', { name: 'name', length: 255 })
  name: string;

  @Column('nvarchar', { name: 'family', length: 255 })
  family: string;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'deleted',
    nullable: true,
    default: () => '(0)',
  })
  deleted: boolean | null;

  @Column('date', { name: 'birthDate', nullable: true })
  birthDate: Date | null;

  @Column('nvarchar', { name: 'phoneNumber', nullable: true, length: 15 })
  phoneNumber: string | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'phoneVerified',
    default: () => '(0)',
  })
  phoneVerified: boolean;

  @Column({
    type: isTestingEnv() ? 'nvarchar' : 'uniqueidentifier',
    name: 'guid',
    unique: !isTestingEnv(),
    nullable: isTestingEnv(),
    default: () => (isTestingEnv() ? null : 'newsequentialid()'),
  })
  guid: string;

  @Column({
    type: 'nvarchar',
    name: 'CloudDirectorUsername',
  })
  cloudDirectorUsername: string;

  @Column('int', { name: 'Credit', nullable: true })
  credit: number | null;

  @Column('int', { name: 'ServiceCount', nullable: true })
  serviceCount: number | null;

  @Column('int', { name: 'TicketCount', nullable: true })
  ticketCount: number | null;
}
