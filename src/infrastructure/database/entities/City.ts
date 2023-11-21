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
import { Company } from './Company';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK__City__3214EC07AF53D481', ['id'], { unique: true })
@Entity('City', { schema: 'security' })
export class City {
  @PrimaryGeneratedColumn({
    type: isTestingEnv() ? 'int' : 'decimal',
    name: 'Id',
    // precision: 18,
    // scale: 0,
  })
  id: number;

  @Column('nvarchar', { name: 'CityName', nullable: true, length: 50 })
  cityName: string | null;

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

  @ManyToOne(() => Province, (province) => province.cities, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ProvinceId', referencedColumnName: 'id' }])
  province: Province;

  @OneToMany(() => Company, (company) => company.city)
  companies: Company[];
}
