import { ApiProperty } from "@nestjs/swagger";
import { Action } from "../enum/action.enum";
import { PredefinedRoles } from "../enum/predefined-enum.type";

export class PredefinedRoleDto {
    @ApiProperty()
    model : PredefinedRoles;

    @ApiProperty()
    action : Action;

    @ApiProperty()
    permission: string;

}