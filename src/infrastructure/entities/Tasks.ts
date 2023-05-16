import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ServiceInstances } from "./ServiceInstances";

@Index("PK__tasks__7C6949D195E39C4E", ["taskId"], { unique: true })
@Entity("Tasks", { schema: "user" })
export class Tasks {
  @Column("uniqueidentifier", { primary: true, name: "TaskID" })
  taskId: string;

  @Column("int", { name: "UserID" })
  userId: number;

  @Column("varchar", { name: "Operation", length: 255 })
  operation: string;

  @Column("nvarchar", { name: "Details", nullable: true })
  details: string | null;

  @Column("datetime", { name: "StartTime", nullable: true })
  startTime: Date | null;

  @Column("datetime", { name: "EndTime", nullable: true })
  endTime: Date | null;

  @Column("varchar", { name: "Status", nullable: true, length: 255 })
  status: string | null;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.tasks,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "ServiceInstanceID", referencedColumnName: "id" }])
  serviceInstance: ServiceInstances;
}