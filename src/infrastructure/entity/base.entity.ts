import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { isTestingEnv } from '../helpers/helpers';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'Guid',
  })
  guid: string;

  @Column('int', {
    name: 'Id',
  })
  id: number;
}
