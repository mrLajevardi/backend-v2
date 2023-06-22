import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupsMapping } from './GroupsMapping';
import { Invoices } from './Invoices';
import { Organization } from './Organization';
import { Transactions } from './Transactions';

@Index('PK__User__3214EC0774485CFE', ['id'], { unique: true })
@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('nvarchar', { name: 'realm', nullable: true, length: 255 })
  realm: string | null;

  @Column('nvarchar', { name: 'username', length: 255 })
  username: string;

  @Column('nvarchar', { name: 'password', length: 255 })
  password: string;

  @Column('nvarchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @Column('boolean', {
    name: 'emailVerified',
    nullable: true,
    default: () => '(0)',
  })
  emailVerified: boolean | null;

  @Column('boolean', { name: 'active', default: () => '(1)' })
  active: boolean;

  @Column('nvarchar', { name: 'name', length: 255 })
  name: string;

  @Column('nvarchar', { name: 'family', length: 255 })
  family: string;

  @Column('boolean', {
    name: 'verificationToken',
    nullable: true,
    default: () => '(0)',
  })
  verificationToken: boolean | null;

  @Column('boolean', { name: 'deleted', nullable: true, default: () => '(0)' })
  deleted: boolean | null;

  @Column('datetime', {
    name: 'createDate',
    nullable: true,
    default: () => 'getdate()',
  })
  createDate: Date | null;

  @Column('datetime', {
    name: 'updateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  updateDate: Date | null;

  @Column('nchar', { name: 'code', nullable: true, length: 10 })
  code: string | null;

  @Column('nvarchar', { name: 'emailToken', nullable: true, length: 50 })
  emailToken: string | null;

  @Column('integer', { name: 'credit', nullable: true, default: () => '(0)' })
  credit: number | null;

  @Column('nvarchar', { name: 'vdcPassword', nullable: true })
  vdcPassword: string | null;

  @Column('boolean', { name: 'hasVdc', nullable: true })
  hasVdc: boolean | null;

  @Column('nvarchar', { name: 'phoneNumber', nullable: true, length: 15 })
  phoneNumber: string | null;

  @Column('nvarchar', { name: 'orgName', nullable: true, length: 50 })
  orgName: string | null;

  @Column('boolean', { name: 'acceptTermsOfService', nullable: true })
  acceptTermsOfService: boolean | null;

  @Column('boolean', { name: 'phoneVerified', default: () => '(0)' })
  phoneVerified: boolean;

  @OneToMany(() => GroupsMapping, (groupsMapping) => groupsMapping.user)
  groupsMappings: GroupsMapping[];

  @OneToMany(() => Invoices, (invoices) => invoices.user)
  invoices: Invoices[];

  @OneToMany(() => Organization, (organization) => organization.user)
  organizations: Organization[];

  @OneToMany(() => Transactions, (transactions) => transactions.user)
  transactions: Transactions[];
}
