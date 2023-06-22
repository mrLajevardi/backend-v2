import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionMappingDto {
  @IsInt()
  @ApiProperty()
  id?: number;

  @IsInt()
  @ApiProperty()
  permissionId?: number;

  @IsInt()
  @ApiProperty()
  permissionGroupId?: number;
}
