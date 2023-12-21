import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'Guid',
  })
  guid: string;

  @PrimaryGeneratedColumn('increment', {
    name: 'Id',
  })
  id: number;
}
