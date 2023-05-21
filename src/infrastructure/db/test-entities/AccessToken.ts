import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "AccessToken" })
export class AccessToken {
  @PrimaryColumn({ type: "text", length: 255 })
  id: string;

  @Column({ type: "integer", nullable: true })
  ttl: number | null;

  @Column({ type: "text", nullable: true, length: 255 })
  scopes: string | null;

  @Column({ type: "datetime", nullable: true })
  created: Date | null;

  @Column({ type: "text", nullable: true, length: 10 })
  userId: string | null;

  @Column({ type: "text", nullable: true, length: 3000 })
  realm: string | null;
}
