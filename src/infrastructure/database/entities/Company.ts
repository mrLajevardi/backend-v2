import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("PK__Company__3213E83F6DC356F4", ["id"], { unique: true })
@Entity("Company", { schema: "security" })
export class Company {
  @Column("nvarchar", { name: "Name", length: 255 })
  companyName: string;

  @Column("nvarchar", { name: "CompanyCode", nullable: true, length: 100 })
  companyCode: string | null;

  @Column("nvarchar", { name: "SubmittedCode", nullable: true, length: 100 })
  submittedCode: string | null;

  @Column("nvarchar", { name: "EconomyCode", nullable: true, length: 100 })
  economyCode: string | null;

  @Column("datetime", { name: "CreateDate", nullable: true , default: () => "getdate()",})
  createDate: Date | null;

  @Column("datetime", { name: "UpdateDate", nullable: true , default: () => "getdate()"})
  updateDate: Date | null;

  // @PrimaryGeneratedColumn({
  //   type: "decimal",
  //   name: "Id",
  //   precision: 18,
  //   scale: 0,
  // })
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { name: "CreatorId", nullable: true })
  creatorId: number | null;

  @Column("int", { name: "LastEditorId", nullable: true })
  lastEditorId: number | null;

  @Column("nvarchar", { name: "IntegCode", nullable: true })
  integCode: string | null;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
