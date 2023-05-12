import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AiTransactionsLogs } from "./AiTransactionsLogs";
import { Invoices } from "./Invoices";
import { ServiceTypes } from "./ServiceTypes";
import { ServiceItems } from "./ServiceItems";
import { ServiceProperties } from "./ServiceProperties";
import { Tasks } from "./Tasks";
import { Tickets } from "./Tickets";

@Index("PK_ServiceInstances", ["id"], { unique: true })
@Entity("ServiceInstances", { schema: "user" })
export class ServiceInstances {
  @Column("uniqueidentifier", { primary: true, name: "ID" })
  id: string;

  @Column("int", { name: "UserID" })
  userId: number;

  @Column("int", { name: "Status", nullable: true })
  status: number | null;

  @Column("datetime", { name: "CreateDate" })
  createDate: Date;

  @Column("datetime", { name: "LastUpdateDate" })
  lastUpdateDate: Date;

  @Column("datetime", { name: "ExpireDate", nullable: true })
  expireDate: Date | null;

  @Column("datetime", { name: "DeletedDate", nullable: true })
  deletedDate: Date | null;

  @Column("bit", { name: "IsDeleted", default: () => "(0)" })
  isDeleted: boolean;

  @Column("int", { name: "Index", nullable: true })
  index: number | null;

  @Column("int", { name: "WarningSent", nullable: true, default: () => "(0)" })
  warningSent: number | null;

  @Column("tinyint", {
    name: "IsDisabled",
    nullable: true,
    default: () => "(0)",
  })
  isDisabled: number | null;

  @Column("nvarchar", { name: "Name", nullable: true, length: 50 })
  name: string | null;

  @Column("float", { name: "PlanRatio", nullable: true, precision: 53 })
  planRatio: number | null;

  @Column("datetime", { name: "LastPAYG", nullable: true })
  lastPayg: Date | null;

  @Column("datetime", { name: "NextPAYG", nullable: true })
  nextPayg: Date | null;

  @OneToMany(
    () => AiTransactionsLogs,
    (aiTransactionsLogs) => aiTransactionsLogs.serviceInstance
  )
  aiTransactionsLogs: AiTransactionsLogs[];

  @OneToMany(() => Invoices, (invoices) => invoices.serviceInstance)
  invoices: Invoices[];

  @ManyToOne(
    () => ServiceTypes,
    (serviceTypes) => serviceTypes.serviceInstances
  )
  @JoinColumn([{ name: "ServiceTypeID", referencedColumnName: "id" }])
  serviceType: ServiceTypes;

  @OneToMany(() => ServiceItems, (serviceItems) => serviceItems.serviceInstance)
  serviceItems: ServiceItems[];

  @OneToMany(
    () => ServiceProperties,
    (serviceProperties) => serviceProperties.serviceInstance
  )
  serviceProperties: ServiceProperties[];

  @OneToMany(() => Tasks, (tasks) => tasks.serviceInstance)
  tasks: Tasks[];

  @OneToMany(() => Tickets, (tickets) => tickets.serviceInstance)
  tickets: Tickets[];
}
