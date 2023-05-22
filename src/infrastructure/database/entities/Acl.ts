import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__ACL__3213E83F35E40E26", ["id"], { unique: true })
@Entity("ACL", { schema: "security" })
export class Acl {
  @Column("nvarchar", { name: "model", nullable: true, length: 255 })
  model: string | null;

  @Column("nvarchar", { name: "property", nullable: true, length: 255 })
  property: string | null;

  @Column("nvarchar", { name: "accessType", nullable: true, length: 255 })
  accessType: string | null;

  @Column("nvarchar", { name: "permission", nullable: true, length: 255 })
  permission: string | null;

  @Column("nvarchar", { name: "principalType", nullable: true, length: 255 })
  principalType: string | null;

  @Column("nvarchar", { name: "principalId", nullable: true, length: 255 })
  principalId: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
}
