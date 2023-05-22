import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_InvoiceProperties", ["id"], { unique: true })
@Entity()
export class InvoiceProperties {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column("integer", { name: "InvoiceID" })
  invoiceId: number;

  @Column("varchar", { name: "PropertyKey", length: 50 })
  propertyKey: string;

  @Column("nvarchar", { name: "Value", nullable: true })
  value: string | null;
}
