import { Column, Entity } from 'typeorm';

@Entity('Plan', { schema: 'vdc' })
export class Plan {
  @Column('decimal', { name: 'Id', nullable: true, precision: 18, scale: 0 })
  id: number | null;

  @Column('datetime', { name: 'CreateDate', nullable: true })
  createDate: Date | null;

  @Column('nvarchar', { name: 'Name', nullable: true, length: 50 })
  name: string | null;

  @Column('nvarchar', { name: 'Description', nullable: true, length: 150 })
  description: string | null;

  @Column('nvarchar', { name: 'Structure', nullable: true })
  structure: string | null;

  @Column('tinyint', { name: 'Month', nullable: true })
  month: number | null;
}
