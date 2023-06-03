import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInfoLogDto {
  @IsInt()
  @IsOptional()
  @ApiProperty()
  userId?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  typeId?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  actionId?: number;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  timeStamp?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  ip?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  object?: string;

  @IsInt()
  @ApiProperty()
  serviceInstanceId: number;
}
