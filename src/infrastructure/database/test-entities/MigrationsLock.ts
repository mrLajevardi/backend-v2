import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__Migratio__1D0A334817D136CF", ["index"], { unique: true })
@Entity()
export class MigrationsLock {
  @PrimaryGeneratedColumn({ type: "integer" })
  index: number;

  @Column("integer", { name: "is_locked", nullable: true })
  isLocked: number | null;
}
