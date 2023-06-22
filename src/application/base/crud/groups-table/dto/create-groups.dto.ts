import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupsDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @ApiProperty()
  color: string;

  @IsDate()
  @ApiProperty()
  createDate: Date;
}
