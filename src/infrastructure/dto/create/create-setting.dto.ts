import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
  @IsNumber()
  @ApiProperty()
  userId: number | null;

  @IsString()
  @ApiProperty()
  key: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  value: string | null;

  @IsDate()
  @ApiProperty()
  insertTime: Date;

  @IsDate()
  @ApiProperty()
  updateTime: Date;
}
