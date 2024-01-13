import { IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @IsString()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsDate()
  @ApiProperty()
  updated?: Date;

  @IsDate()
  @ApiProperty()
  modified?: Date;
}
