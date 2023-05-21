import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "ACL" })
export class Acl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true, length: 255 })
  model: string | null;

  @Column({ type: "text", nullable: true, length: 255 })
  property: string | null;

  @Column({ type: "text", nullable: true, length: 255 })
  accessType: string | null;

  @Column({ type: "text", nullable: true, length: 255 })
  permission: string | null;

  @Column({ type: "text", nullable: true, length: 255 })
  principalType: string | null;

  @Column({ type: "text", nullable: true, length: 255 })
  principalId: string | null;
}
