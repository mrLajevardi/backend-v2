import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  id?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsDate()
  @ApiProperty()
  created: Date;

  @IsDate()
  @ApiProperty()
  modified: Date;
}
