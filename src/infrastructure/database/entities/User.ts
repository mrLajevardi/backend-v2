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
import { Files } from './Files';
import { GroupsMapping } from './GroupsMapping';
import { Invoices } from './Invoices';
import { Organization } from './Organization';
import { Transactions } from './Transactions';
import { EntityLog } from './EntityLog';
console.log('user working');

@Index('IX_User', ['phoneNumber'], {})
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

  @Column('bit', {
    name: 'emailVerified',
    nullable: true,
    default: () => '(0)',
  })
  emailVerified: boolean | null;

  @Column('bit', { name: 'active', default: () => '(1)' })
  active: boolean;

  @Column('nvarchar', { name: 'name', length: 255 })
  name: string;

  @Column('nvarchar', { name: 'family', length: 255 })
  family: string;

  @Column('bit', {
    name: 'verificationToken',
    nullable: true,
    default: () => '(0)',
  })
  verificationToken: boolean | null;

  @Column('bit', { name: 'deleted', nullable: true, default: () => '(0)' })
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

  @Column('bit', { name: 'hasVdc', nullable: true })
  hasVdc: boolean | null;

  @Column('nvarchar', { name: 'phoneNumber', nullable: true, length: 15 })
  phoneNumber: string | null;

  @Column('nvarchar', { name: 'orgName', nullable: true, length: 50 })
  orgName: string | null;

  @Column('bit', { name: 'acceptTermsOfService', nullable: true })
  acceptTermsOfService: boolean | null;

  @Column('bit', { name: 'phoneVerified', default: () => '(0)' })
  phoneVerified: boolean;

  @Column('date', { name: 'birthDate', nullable: true })
  birthDate: Date | null;

  @Column('nvarchar', { name: 'personalCode', nullable: true, length: 100 })
  personalCode: string | null;

  @Column('bit', { name: 'companyOwner', nullable: true, default: () => '(0)' })
  companyOwner: boolean | null;

  @Column('uniqueidentifier', {
    name: 'guid',
    nullable: true,
    default: () => 'newsequentialid()',
  })
  guid: string | null;

  @Column('bit', {
    name: 'personalVerification',
    nullable: true,
    default: () => '(0)',
  })
  personalVerification: boolean | null;

  @Column('nvarchar', {
    name: 'twoFactorAuth',
    nullable: true,
    length: 50,
    default: () => '(0)',
  })
  twoFactorAuth: string | null;
  @Column('decimal', { name: 'companyId', nullable: true })
  companyId: number | null;
  @Column('uniqueidentifier', { name: 'avatarId', nullable: true })
  avatarId: string | null;

  @Column('uniqueidentifier', { name: 'companyLetterId', nullable: true })
  companyLetterId: string | null;

  @Column('tinyint', { name: 'companyLetterStatus', nullable: true })
  companyLetterStatus: number | null;
  // @OneToMany(() => GroupsMapping, (groupsMapping) => groupsMapping.user)
  // groupsMappings: GroupsMapping[];

  // @OneToMany(() => Invoices, (invoices) => invoices.user)
  // invoices: Invoices[];

  // @OneToMany(() => Organization, (organization) => organization.user)
  // organizations: Organization[];

  // @OneToMany(() => Transactions, (transactions) => transactions.user)
  // transactions: Transactions[];

  // @OneToMany(() => EntityLog, (entityLog) => entityLog.user)
  // entityLog: EntityLog[];

  // @ManyToOne(() => Company, (company) => company.users)
  // @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  // company: Company;

  // @ManyToOne(() => Files /*, (file) => file.user*/)
  // @JoinColumn({ name: 'avatarId', referencedColumnName: 'guid' })
  // avatar: Files;

  // @ManyToOne(() => Files)
  // @JoinColumn({ name: 'companyLetterId', referencedColumnName: 'guid' })
  // companyLetter: Files;
}
