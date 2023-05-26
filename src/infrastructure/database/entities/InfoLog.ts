import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServiceInstances } from "./ServiceInstances";

@Index("PK__infoLogs__3213E83F1713A44E", ["id"], { unique: true })
@Entity("InfoLog", { schema: "logs" })
export class InfoLog {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("int", { name: "UserID", nullable: true })
  userId: number | null;

  @Column("int", { name: "TypeID", nullable: true })
  typeId: number | null;

  @Column("int", { name: "ActionID", nullable: true })
  actionId: number | null;

  @Column("datetime", { name: "TimeStamp", nullable: true })
  timeStamp: Date | null;

  @Column("nvarchar", { name: "Description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "IP", nullable: true, length: 40 })
  ip: string | null;

  @Column("varchar", { name: "Object", nullable: true })
  object: string | null;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.infoLogs,
    { onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "ServiceInstanceID", referencedColumnName: "id" }])
  serviceInstance: ServiceInstances;
}
