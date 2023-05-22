import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_InvoiceProperties", ["id"], { unique: true })
@Entity("InvoiceProperties", { schema: "user" })
export class InvoiceProperties {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("int", { name: "InvoiceID" })
  invoiceId: number;

  @Column("varchar", { name: "PropertyKey", length: 50 })
  propertyKey: string;

  @Column("nvarchar", { name: "Value", nullable: true })
  value: string | null;
}
