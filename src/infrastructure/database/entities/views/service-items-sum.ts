import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ServiceItemsSum {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'int' })
  Sum: number;
}
