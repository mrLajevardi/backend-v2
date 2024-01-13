import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionGroupsMappingsDto {
  @IsInt()
  @ApiProperty()
  id?: number;

  @IsInt()
  @ApiProperty()
  permissionGroupId?: number;

  @IsInt()
  @ApiProperty()
  roleId?: string;
}
