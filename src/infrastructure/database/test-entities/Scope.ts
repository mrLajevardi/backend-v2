import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__Scope__3213E83F6ECDAE1D", ["id"], { unique: true })
@Entity()
export class Scope {
  @Column("nvarchar", { name: "name", length: 255 })
  name: string;

  @Column("nvarchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;
}
