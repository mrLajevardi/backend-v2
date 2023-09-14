import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ServiceTypes } from './ServiceTypes';

@Index('PK__ItemType__3214EC27D43301C5', ['id'], { unique: true })
@Entity('ItemTypesConfig', { schema: 'services' })
export class ItemTypesConfig {
  @Column('int', { primary: true, name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('nvarchar', { name: 'Unit' })
  unit: string;

  @Column('float', { name: 'Price', precision: 53 })
  price: number;

  @Column('varchar', { name: 'Code', length: 255 })
  code: string;

  @Column('int', { name: 'Max', nullable: true })
  max: number | null;

  @Column('int', { name: 'Min', nullable: true })
  min: number | null;

  @Column('nvarchar', { name: 'Rull', nullable: true })
  rull: string | null;

  @Column('int', { name: 'ParentId', nullable: true })
  parentId: number | null;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
    default: () => 'getdate()',
  })
  createDate: Date | null;

  @Column('int', { name: 'Percent', nullable: true })
  percent: number | null;

  @Column('tinyint', { name: 'PrinciplePrice', nullable: true })
  principlePrice: number | null;

  @ManyToOne(
    () => ServiceTypes,
    (serviceTypes) => serviceTypes.itemTypesConfigs,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'ServiceTypeID', referencedColumnName: 'id' }])
  serviceType: ServiceTypes;
}
