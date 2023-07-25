import { ApiProperty } from "@nestjs/swagger";
import { PredefinedRoles } from "../enum/predefined-enum.type";

export class AssignPredefinedRoleDto {
    @ApiProperty({ enum: PredefinedRoles, enumName: 'PredefinedRoles' })
    role: PredefinedRoles;
  }