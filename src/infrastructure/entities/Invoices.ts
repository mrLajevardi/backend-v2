import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { ServiceInstances } from "./ServiceInstances";

@Index("PK_Invoices", ["id"], { unique: true })
@Entity("Invoices", { schema: "user" })
export class Invoices {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "ServiceTypeID", length: 50, default: () => "''" })
  serviceTypeId: string;

  @Column("float", { name: "RawAmount", precision: 53 })
  rawAmount: number;

  @Column("float", { name: "PlanAmount", precision: 53 })
  planAmount: number;

  @Column("float", { name: "PlanRatio", nullable: true, precision: 53 })
  planRatio: number | null;

  @Column("float", { name: "FinalAmount", precision: 53 })
  finalAmount: number;

  @Column("nvarchar", { name: "Description" })
  description: string;

  @Column("datetime", { name: "DateTime" })
  dateTime: Date;

  @Column("bit", { name: "Payed" })
  payed: boolean;

  @Column("bit", { name: "Voided" })
  voided: boolean;

  @Column("int", {name: "UserID"})
  userId: number;

  @Column("datetime", { name: "EndDateTime", default: () => "getdate()" })
  endDateTime: Date;

  @Column("int", { name: "Type", default: () => "(0)" })
  type: number;

  @Column("nvarchar", { name: "Name", nullable: true, length: 50 })
  name: string | null;

  @ManyToOne(() => User, (user) => user.invoices, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "UserID", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.invoices,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "ServiceInstanceID", referencedColumnName: "id" }])
  serviceInstance: ServiceInstances;
}