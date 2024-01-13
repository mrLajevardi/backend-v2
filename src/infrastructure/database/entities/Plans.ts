import { Column, Entity, Index } from 'typeorm';
console.log('plans working');

@Index('PK_QualityPlans', ['code'], { unique: true })
@Entity('Plans', { schema: 'services' })
export class Plans {
  @Column('varchar', { primary: true, name: 'Code', length: 25 })
  code: string;

  @Column('float', { name: 'AdditionRatio', precision: 53 })
  additionRatio: number;

  @Column('float', { name: 'AdditionAmount', precision: 53 })
  additionAmount: number;

  @Column('nvarchar', { name: 'Description' })
  description: string;

  @Column('nvarchar', { name: 'Condition', default: () => "''" })
  condition: string;

  @Column('bit', { name: 'Enabled', default: () => '(1)' })
  enabled: boolean;

  @Column('varchar', { name: 'ApplyTo', nullable: true, length: 255 })
  applyTo: string | null;
}
