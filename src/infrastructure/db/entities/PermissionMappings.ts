import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Permissions } from "./Permissions";
import { PermissionGroups } from "./PermissionGroups";

@Index("PK__Permissi__3214EC2738CD4D11", ["id"], { unique: true })
@Entity("PermissionMappings", { schema: "security" })
export class PermissionMappings {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @ManyToOne(
    () => Permissions,
    (permissions) => permissions.permissionMappings,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "PermissionID", referencedColumnName: "id" }])
  permission: Permissions;

  @ManyToOne(
    () => PermissionGroups,
    (permissionGroups) => permissionGroups.permissionMappings,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "PermissionGroupID", referencedColumnName: "id" }])
  permissionGroup: PermissionGroups;
}
