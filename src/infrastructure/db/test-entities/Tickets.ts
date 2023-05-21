import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm/browser";
import { ServiceInstances } from "./ServiceInstances";

@Index("PK__Tickets__3214EC2736EDC157", ["id"], { unique: true })
@Entity()
export class Tickets {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column("integer", { name: "UserID" })
  userId: number;

  @Column("integer", { name: "TicketID" })
  ticketId: number;

  @ManyToOne(
    () => ServiceInstances,
    (serviceInstances) => serviceInstances.tickets,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "ServiceInstanceID", referencedColumnName: "id" }])
  serviceInstance: ServiceInstances;
}
