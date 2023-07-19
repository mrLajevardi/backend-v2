import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleMappingDto {
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsString()
  @ApiProperty()
  principalType: string;

  @IsString()
  @ApiProperty()
  principalId: string;

  @IsString()
  @ApiProperty()
  roleId: string;


}
