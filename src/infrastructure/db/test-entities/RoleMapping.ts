import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";

@Index("PK__RoleMapp__3213E83F75DAA2FC", ["id"], { unique: true })
@Index("principalId_NONCLUSTERED_ASC_idx", ["principalId"], {})
@Entity("RoleMapping", { schema: "security" })
export class RoleMapping {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("nvarchar", { name: "principalType", nullable: true, length: 255 })
  principalType: string | null;

  @Column("nvarchar", { name: "principalId", nullable: true, length: 255 })
  principalId: string | null;

  @ManyToOne(() => Role, (role) => role.roleMappings, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "roleId", referencedColumnName: "id" }])
  role: Role;
}
