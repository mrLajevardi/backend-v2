import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './City';
import { Company } from './Company';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK__Province__CDEB13F8B25813F1', ['id'], { unique: true })
@Entity('Province', { schema: 'security' })
export class Province {
  @PrimaryGeneratedColumn({
    type: isTestingEnv() ? 'int' : 'decimal',
    name: 'Id',
    // precision: 18,
    // scale: 0,
  })
  id: number;

  @Column('nvarchar', { name: 'ProvineName', nullable: true, length: 50 })
  provineName: string | null;

  @Column('nvarchar', { name: 'PhoneCode', nullable: true, length: 25 })
  phoneCode: string | null;

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

  @Column('decimal', {
    name: 'LastEditorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  lastEditorId: number | null;

  @Column('decimal', {
    name: 'CreatorId',
    nullable: true,
    precision: 18,
    scale: 0,
  })
  creatorId: number | null;

  @Column('nvarchar', { name: 'IntegCode', nullable: true })
  integCode: string | null;

  @Column({
    type: isTestingEnv() ? 'varchar' : 'uniqueidentifier',
    name: 'Guid',
    nullable: true,
    default: () => 'newsequentialid()',
  })
  guid: string | null;

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  @OneToMany(() => Company, (company) => company.province)
  companies: Company[];
}
