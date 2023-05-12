import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "./Organization";

@Index("PK__sessions__3213E83FD79F4A05", ["id"], { unique: true })
@Entity("Sessions", { schema: "vdc" })
export class Sessions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("nvarchar", { name: "sessionId" })
  sessionId: string;

  @Column("text", { name: "token" })
  token: string;

  @Column("bit", { name: "active" })
  active: boolean;

  @Column("datetime", { name: "createDate", nullable: true })
  createDate: Date | null;

  @Column("datetime", { name: "updateDate", nullable: true })
  updateDate: Date | null;

  @Column("bit", { name: "isAdmin", nullable: true })
  isAdmin: boolean | null;

  @ManyToOne(() => Organization, (organization) => organization.sessions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "orgId", referencedColumnName: "id" }])
  org: Organization;
}
