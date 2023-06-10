import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionMappingDto {
  @IsInt()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsInt()
  @ApiProperty()
  permissionId: number;

  @IsInt()
  @ApiProperty()
  permissionGroupId: number;
}
