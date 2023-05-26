import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__sysdiagr__C2B05B61356F80C3", ["diagramId"], { unique: true })
@Index("UK_principal_name", ["principalId", "name"], { unique: true })
@Entity()
export class Sysdiagrams {
  @Column("nvarchar", { name: "name", unique: true, length: 128 })
  name: string;

  @Column("integer", { name: "principal_id", unique: true })
  principalId: number;

  @PrimaryGeneratedColumn({ type: "integer" })
  diagramId: number;

  @Column("integer", { name: "version", nullable: true })
  version: number | null;

  @Column("varbinary", { name: "definition", nullable: true })
  definition: Buffer | null;
}
