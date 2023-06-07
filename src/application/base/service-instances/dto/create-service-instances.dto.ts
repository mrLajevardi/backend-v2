import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceInstancesDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  status?: number;

  @IsDate()
  @ApiProperty()
  createDate: Date;

  @IsDate()
  @ApiProperty()
  lastUpdateDate: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  expireDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  deletedDate?: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isDeleted?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  index?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  warningSent?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  isDisabled?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  planRatio?: number;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  lastPayg?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  nextPayg?: Date;
}
