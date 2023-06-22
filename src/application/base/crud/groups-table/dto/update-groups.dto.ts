import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupsDto {
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @ApiProperty()
  color?: string;

  @IsDate()
  @ApiProperty()
  updateDate?: Date;
}
