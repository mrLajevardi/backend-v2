import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({
  schema: 'user',
  name: 'ServiceItemsSum',
})
export class ServiceItemsSum {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'int' })
  sum: number;
}
