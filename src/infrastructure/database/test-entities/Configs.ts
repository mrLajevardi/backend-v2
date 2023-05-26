import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServiceTypes } from "./ServiceTypes";

//@Index("PK_services.Config", ["id"], { unique: true })
@Entity()
export class Configs {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column("varchar", { name: "PropertyKey", length: 50 })
  propertyKey: string;

  @Column("varchar", { name: "Value", length: 100 })
  value: string;

  @ManyToOne(() => ServiceTypes, (serviceTypes) => serviceTypes.configs, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "ServiceTypeID", referencedColumnName: "id" }])
  serviceType: ServiceTypes;
}
