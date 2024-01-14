import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './Province';
import { City } from './City';
import { User } from './User';
import { Files } from './Files';
console.log('im here company');

@Index('PK__Company__3213E83F6DC356F4', ['id'], { unique: true })
@Entity('Company', { schema: 'security' })
export class Company {
  @Column('nvarchar', { name: 'Name', length: 255 })
  companyName: string;

  @Column('nvarchar', { name: 'CompanyCode', nullable: true, length: 100 })
  companyCode: string | null;

  @Column('nvarchar', { name: 'SubmittedCode', nullable: true, length: 100 })
  submittedCode: string | null;

  @Column('nvarchar', { name: 'EconomyCode', nullable: true, length: 100 })
  economyCode: string | null;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  createDate: Date | null;

  @Column('datetime', {
    name: 'UpdateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  updateDate: Date | null;

  @PrimaryGeneratedColumn()
  @Column('decimal', {
    name: 'Id',
    precision: 18,
    scale: 0,
    primary: true,
  })
  id: number;

  @Column('int', { name: 'CreatorId', nullable: true })
  creatorId: number | null;

  @Column('int', { name: 'LastEditorId', nullable: true })
  lastEditorId: number | null;

  @Column('nvarchar', { name: 'IntegCode', nullable: true })
  integCode: string | null;

  @Column('decimal', { name: 'ProvinceId', nullable: true })
  provinceId: number | null;

  @Column('decimal', { name: 'CityId', nullable: true })
  cityId: number | null;
  @Column('nvarchar', { name: 'PhoneNumber', nullable: true, length: 50 })
  companyPhoneNumber: string | null;

  @Column('nvarchar', { name: 'PostalCode', nullable: true, length: 100 })
  companyPostalCode: string | null;

  @Column('nvarchar', { name: 'Address', nullable: true })
  companyAddress: string | null;

  @Column('uniqueidentifier', { name: 'LogoId', nullable: true })
  LogoId: string | null;

  @Column('uniqueidentifier', {
    name: 'Guid',
    nullable: true,
    default: () => 'newsequentialid()',
  })
  guid: string | null;

  // @ManyToOne(() => Province, (province) => province.companies)
  // @JoinColumn([{ name: 'ProvinceId', referencedColumnName: 'id' }])
  // province: Province;

  // @ManyToOne(() => City, (city) => city.companies)
  // @JoinColumn([{ name: 'CityId', referencedColumnName: 'id' }])
  // city: City;

  // @OneToMany(() => User, (user) => user.company)
  // users: User[];

  // @ManyToOne(() => Files)
  // @JoinColumn({ name: 'LogoId', referencedColumnName: 'guid' })
  // companyLogo: Files;
}
