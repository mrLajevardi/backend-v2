import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ServiceItemsSum {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'integer' })
  Sum: number;
}
