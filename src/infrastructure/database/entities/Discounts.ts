import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceTypes } from './ServiceTypes';
import { InvoiceDiscounts } from './InvoiceDiscounts';
import { isTestingEnv } from 'src/infrastructure/helpers/helpers';

@Index('PK_Discounts', ['id'], { unique: true })
@Entity('Discounts', { schema: 'financial' })
export class Discounts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'Title' })
  title: string;

  @Column('float', { name: 'Ratio', precision: 53 })
  ratio: number;

  @Column('float', { name: 'Amount', precision: 53 })
  amount: number;

  @Column(isTestingEnv() ? 'boolean' : 'bit', { name: 'IsBuiltIn' })
  isBuiltIn: boolean;

  @Column('datetime', { name: 'ValidDate', nullable: true })
  validDate: Date | null;

  @Column('int', { name: 'Limit', nullable: true })
  limit: number | null;

  @Column('varchar', { name: 'Code', nullable: true, length: 50 })
  code: string | null;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.discounts)
  @JoinColumn([
    { name: 'ServiceTypeID', referencedColumnName: 'id' },
    { name: 'DatacenterName', referencedColumnName: 'datacenterName' },
  ])
  serviceTypes: ServiceTypes;
  @Column('varchar', { name: 'ServiceTypeID' })
  serviceTypeId: string;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.discounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'ServiceTypeID', referencedColumnName: 'id' },
    { name: 'DatacenterName', referencedColumnName: 'datacenterName' },
  ])
  serviceType: ServiceTypes;

  @OneToMany(
    () => InvoiceDiscounts,
    (invoiceDiscounts) => invoiceDiscounts.discount,
  )
  invoiceDiscounts: InvoiceDiscounts[];
}
