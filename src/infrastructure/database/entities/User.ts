import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './Company';
import { GroupsMapping } from './GroupsMapping';
import { Invoices } from './Invoices';
import { Organization } from './Organization';
import { Transactions } from './Transactions';
import { isTestingEnv } from '../../helpers/helpers';

@Index('PK__User__3214EC0774485CFE', ['id'], { unique: true })
@Entity('User', { schema: 'security' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('nvarchar', { name: 'realm', nullable: true, length: 255 })
  realm: string | null;

  @Column('nvarchar', { name: 'username', length: 255 })
  username: string;

  @Column('nvarchar', { name: 'password', length: 255 })
  password: string;

  @Column('nvarchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'emailVerified',
    nullable: true,
    default: () => '(0)',
  })
  emailVerified: boolean | null;

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
    name: 'verificationToken',
    nullable: true,
    default: () => '(0)',
  })
  verificationToken: boolean | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'deleted',
    nullable: true,
    default: () => '(0)',
  })
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

  @Column('int', { name: 'credit', nullable: true, default: () => '(0)' })
  credit: number | null;

  @Column('nvarchar', { name: 'vdcPassword', nullable: true })
  vdcPassword: string | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'hasVdc',
    nullable: true,
  })
  hasVdc: boolean | null;

  @Column('nvarchar', { name: 'phoneNumber', nullable: true, length: 15 })
  phoneNumber: string | null;

  @Column('nvarchar', { name: 'orgName', nullable: true, length: 50 })
  orgName: string | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'acceptTermsOfService',
    nullable: true,
  })
  acceptTermsOfService: boolean | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'phoneVerified',
    default: () => '(0)',
  })
  phoneVerified: boolean;

  @Column('date', { name: 'birthDate', nullable: true })
  birthDate: Date | null;

  @Column('nvarchar', { name: 'personalCode', nullable: true, length: 100 })
  personalCode: string | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'companyOwner',
    nullable: true,
    default: () => '(0)',
  })
  companyOwner: boolean | null;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'personalVerification',
    nullable: true,
    default: () => 1,
  })
  personalVerification: boolean | null;

  @Column('tinyint', {
    name: 'twoFactorAuth',
    nullable: true,
    default: () => 0,
  })
  twoFactorAuth: number;

  @Column('date', { name: 'companyId', nullable: true })
  companyId: number | null;

  @OneToMany(() => GroupsMapping, (groupsMapping) => groupsMapping.user)
  groupsMappings: GroupsMapping[];

  @OneToMany(() => Invoices, (invoices) => invoices.user)
  invoices: Invoices[];

  @OneToMany(() => Organization, (organization) => organization.user)
  organizations: Organization[];

  @OneToMany(() => Transactions, (transactions) => transactions.user)
  transactions: Transactions[];

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
