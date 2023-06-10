import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionGroupsMappingsDto {
  @IsInt()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsInt()
  @ApiProperty()
  permissionGroupId: number;

  @IsInt()
  @ApiProperty()
  roleId: number;
}
