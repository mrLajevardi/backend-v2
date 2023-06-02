import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionGroupsMappingDto {
  @IsInt()
  @ApiProperty()
  id: number;

  @IsInt()
  @ApiProperty()
  permissionGroupId: number;

  @IsInt()
  @ApiProperty()
  roleId: number;
}
