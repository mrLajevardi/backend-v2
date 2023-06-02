import { IsOptional, IsNumber, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateErrorLogDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  userId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  message?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  stackTrace?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false })
  timeStamp?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  request?: string;
}
