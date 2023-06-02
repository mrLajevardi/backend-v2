import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAclDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  model?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  property?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  accessType?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  permission?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  principalType?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  principalId?: string;
}
