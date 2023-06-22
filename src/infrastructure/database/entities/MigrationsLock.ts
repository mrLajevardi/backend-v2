import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK__Migratio__1D0A334817D136CF', ['index'], { unique: true })
@Entity('Migrations_lock', { schema: 'security' })
export class MigrationsLock {
  @PrimaryGeneratedColumn({ type: 'int', name: 'index' })
  index: number;

  @Column('int', { name: 'is_locked', nullable: true })
  isLocked: number | null;
}
