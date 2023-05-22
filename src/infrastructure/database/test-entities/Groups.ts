import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupsMapping } from "./GroupsMapping";

@Index("PK__Groups__3214EC27686FB04E", ["id"], { unique: true })
@Entity()
export class Groups {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column("nvarchar", { name: "Name", length: 50 })
  name: string;

  @Column("nvarchar", { name: "Description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "Color", length: 10 })
  color: string;

  @Column("datetime", { name: "CreateDate" })
  createDate: Date;

  @OneToMany(() => GroupsMapping, (groupsMapping) => groupsMapping.group)
  groupsMappings: GroupsMapping[];
}
