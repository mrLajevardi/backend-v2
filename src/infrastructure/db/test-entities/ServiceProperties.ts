import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm/browser";
import { ServiceInstances } from "./ServiceInstances";

@Index("IX_ServiceProperties", ["serviceInstanceId"], {})
@Index("PK_ServiceProperties", ["id"], { unique: true })
@Entity()
export class ServiceProperties {
  @Column("text", { name: "ServiceInstanceID" })
  serviceInstanceId: string;

  @Column("varchar", { name: "PropertyKey", length: 50 })
  propertyKey: string;

  @Column("nvarchar", { name: "Value", nullable: true })
  value: string | null;

  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.serviceProperties,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "ServiceInstanceID", referencedColumnName: "id" }])
  serviceInstance: ServiceInstances;
}
