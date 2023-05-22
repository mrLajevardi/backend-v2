import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__SystemSe__3214EC271FD0CEF8", ["id"], { unique: true })
@Entity("SystemSettings", { schema: "security" })
export class SystemSettings {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("nvarchar", { name: "PropertyKey", length: 50 })
  propertyKey: string;

  @Column("nvarchar", { name: "Value" })
  value: string;

  @Column("datetime", { name: "CreateDate", nullable: true })
  createDate: Date | null;

  @Column("datetime", { name: "UpdateDate", nullable: true })
  updateDate: Date | null;
}
