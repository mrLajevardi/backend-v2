import { isTestingEnv } from 'src/infrastructure/helpers/helpers';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK__Migratio__3213E83FC60BF224', ['id'], { unique: true })
@Entity('Migrations', { schema: 'system' })
export class Migrations {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('nvarchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('int', { name: 'batch', nullable: true })
  batch: number | null;

  @Column(isTestingEnv() ? 'datetime' : 'datetime2', {
    name: 'migration_time',
    nullable: true,
  })
  migrationTime: Date | null;
}
