import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { isTestingEnv } from '../helpers/helpers';

@Entity()
export class BaseEntity {
  @Column('uniqueidentifier', {
    primary: true,
    name: 'Guid',
    default: () => 'newsequentialid()',
  })
  guid: string;

  @Column('decimal', { name: 'Id', nullable: true, precision: 18, scale: 0 })
  id: number | null;
}
