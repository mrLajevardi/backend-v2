import {
  AfterLoad,
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
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Files } from './Files';
import { decryptVdcPassword } from '../../utils/extensions/encrypt.extensions';

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
    default: () => (isTestingEnv() ? 'CURRENT_TIMESTAMP' : 'getdate()'),
  })
  createDate: Date | null;

  @Column('datetime', {
    name: 'updateDate',
    nullable: true,
    default: () => (isTestingEnv() ? 'CURRENT_TIMESTAMP' : 'getdate()'),
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

  @Column('nvarchar', {
    name: 'twoFactorAuth',
    nullable: true,
    default: () => '0',
  })
  twoFactorAuth: string;

  @Column('decimal', { name: 'companyId', nullable: true })
  companyId: number | null;

  @Column({
    type: isTestingEnv() ? 'varchar' : 'uniqueidentifier',
    name: 'avatarId',
    nullable: true,
  })
  avatarId: string | null;

  @Column({
    type: isTestingEnv() ? 'varchar' : 'uniqueidentifier',
    name: 'companyLetterId',
    nullable: true,
  })
  companyLetterId: string | null;

  @Column('tinyint', {
    name: 'companyLetterStatus',
    nullable: true,
    default: () => 0,
  })
  companyLetterStatus: number;

  @Column({
    type: isTestingEnv() ? 'nvarchar' : 'uniqueidentifier',
    name: 'guid',
    unique: !isTestingEnv(),
    nullable: isTestingEnv(),
    default: () => (isTestingEnv() ? null : 'newsequentialid()'),
  })
  guid: string;

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

  @ManyToOne(() => Files /*, (file) => file.user*/)
  @JoinColumn({ name: 'avatarId', referencedColumnName: 'guid' })
  avatar: Files;

  @ManyToOne(() => Files)
  @JoinColumn({ name: 'companyLetterId', referencedColumnName: 'guid' })
  companyLetter: Files;

  @AfterLoad()
  decrypt() {
    this.vdcPassword = decryptVdcPassword(this.vdcPassword);
  }
}
