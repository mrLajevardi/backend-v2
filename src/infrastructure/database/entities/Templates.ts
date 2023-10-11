import { Column, Entity } from "typeorm";

@Entity("Templates", { schema: "services" })
export class Templates {
  @Column("decimal", { name: "ID", nullable: true, precision: 18, scale: 0 })
  id: number | null;

  @Column("datetime", { name: "CreateDate", nullable: true })
  createDate: Date | null;

  @Column("datetime", { name: "LastEditDate", nullable: true })
  lastEditDate: Date | null;

  @Column("decimal", {
    name: "CreatorId",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  creatorId: number | null;

  @Column("decimal", {
    name: "LastEditorId",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  lastEditorId: number | null;

  @Column("nvarchar", { name: "Name", nullable: true, length: 50 })
  name: string | null;

  @Column("nvarchar", { name: "Description", nullable: true, length: 150 })
  description: string | null;

  @Column("nvarchar", { name: "Structure", nullable: true })
  structure: string | null;

  @Column("tinyint", { name: "Month", nullable: true })
  month: number | null;

  @Column("bit", { name: "Enabled", nullable: true })
  enabled: boolean | null;

  @Column("varchar", { name: "ServiceTypeId", nullable: true, length: 50 })
  serviceTypeId: string | null;

  @Column("nvarchar", { name: "DatacenterName", nullable: true, length: 50 })
  datacenterName: string | null;

  @Column("uniqueidentifier", {
    name: "Guid",
    nullable: true,
    default: () => "newsequentialid()",
  })
  guid: string | null;
}
