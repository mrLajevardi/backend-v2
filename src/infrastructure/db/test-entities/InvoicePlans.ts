import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm/browser";

@Index("PK_InvoicePlans", ["id"], { unique: true })
@Entity()
export class InvoicePlans {
  @Column("integer", { name: "InvoiceID" })
  invoiceId: number;

  @Column("varchar", { name: "PlanCode", length: 25 })
  planCode: string;

  @Column("float", { name: "Ratio", precision: 53 })
  ratio: number;

  @Column("float", { name: "Amount", precision: 53 })
  amount: number;

  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;
}
