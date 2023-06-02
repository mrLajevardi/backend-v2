import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionGroupsMappingDto {
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
