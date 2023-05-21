import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm/browser";

@Index("PK__Setting__3214EC07107FD346", ["id"], { unique: true })
@Entity()
export class Setting {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column("integer", { name: "UserId", nullable: true })
  userId: number | null;

  @Column("nvarchar", { name: "Key", length: 50 })
  key: string;

  @Column("ntext", { name: "Value", nullable: true })
  value: string | null;

  @Column("datetime", { name: "InsertTime", default: () => "getdate()" })
  insertTime: Date;

  @Column("datetime", { name: "UpdateTime", default: () => "getdate()" })
  updateTime: Date;
}
