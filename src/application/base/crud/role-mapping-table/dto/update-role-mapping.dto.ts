import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleMappingDto {
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  principalType?: string;

  @IsString()
  @ApiProperty()
  principalId?: string;

  @IsNumber()
  @ApiProperty()
  roleId?: number;
}
