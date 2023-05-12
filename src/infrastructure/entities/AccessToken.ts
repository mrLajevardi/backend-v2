import { Column, Entity, Index } from "typeorm";

@Index("PK__AccessTo__3213E83F2F499218", ["id"], { unique: true })
@Entity("AccessToken", { schema: "security" })
export class AccessToken {
  @Column("nvarchar", { primary: true, name: "id", length: 255 })
  id: string;

  @Column("int", { name: "ttl", nullable: true })
  ttl: number | null;

  @Column("nvarchar", { name: "scopes", nullable: true, length: 255 })
  scopes: string | null;

  @Column("datetime", { name: "created", nullable: true })
  created: Date | null;

  @Column("nvarchar", { name: "userId", nullable: true, length: 10 })
  userId: string | null;

  @Column("nvarchar", { name: "realm", nullable: true, length: 3000 })
  realm: string | null;
}
