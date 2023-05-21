import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm/browser";

@Index("PK__Migratio__3213E83FC60BF224", ["id"], { unique: true })
@Entity()
export class Migrations {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column("nvarchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("integer", { name: "batch", nullable: true })
  batch: number | null;

  @Column("datetime2", { name: "migration_time", nullable: true })
  migrationTime: Date | null;
}
