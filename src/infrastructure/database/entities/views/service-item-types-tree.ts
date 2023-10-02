import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceTypes } from '../ServiceTypes';
import { isTestingEnv } from '../../../helpers/helpers';
@Entity({
  schema: 'services',
  name: 'ServiceItemTypesTree',
})
export class ServiceItemTypesTree {
  @Column('int', { primary: true, name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'DatacenterName', nullable: true, length: 50 })
  datacenterName: string | null;

  @Column('nvarchar', { name: 'Title', nullable: true })
  title: string | null;

  @Column('nvarchar', { name: 'Unit', nullable: true })
  unit: string | null;

  @Column('float', { name: 'Price', nullable: true, precision: 53 })
  fee: number | null;

  @Column('int', { name: 'MaxAvailable', nullable: true })
  maxAvailable: number | null;

  @Column('varchar', { name: 'Code', nullable: true, length: 255 })
  code: string | null;

  @Column('int', { name: 'Max', nullable: true })
  maxPerRequest: number | null;

  @Column('int', { name: 'Min', nullable: true })
  minPerRequest: number | null;

  @Column('nvarchar', { name: 'Rule', nullable: true })
  rule: string | null;

  @Column('int', { name: 'ParentId', nullable: true })
  parentId: number | null;

  @Column('datetime', {
    name: 'CreateDate',
    nullable: true,
  })
  createDate: Date | null;

  @Column('int', { name: 'Percent', nullable: true })
  percent: number | null;

  @Column('tinyint', { name: 'PrinciplePrice', nullable: true })
  principlePrice: number | null;

  @Column('varchar', { name: 'ServiceTypeID', length: 50 })
  serviceTypeId: string;

  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'Required',
    nullable: true,
  })
  required: boolean | null;
  @Column(isTestingEnv() ? 'boolean' : 'bit', {
    name: 'Enabled',
    nullable: true,
  })
  enabled: boolean | null;

  @Column('int', { name: 'Step', nullable: true })
  step: number | null;

  @Column({ name: 'Level' })
  level: number;

  @Column('nvarchar', { name: 'Hierarchy', nullable: true, length: 50 })
  hierarchy: string;

  @Column('nvarchar', { name: 'CodeHierarchy', nullable: true, length: 150 })
  codeHierarchy: string;

  @ManyToOne(() => ServiceTypes)
  @JoinColumn({ name: 'ServiceTypeID', referencedColumnName: 'id' })
  serviceTypes: ServiceTypes;
}
