import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTasksDto {
  @IsString()
  @ApiProperty()
  taskId?: string;

  @IsNumber()
  @ApiProperty()
  userId?: number;

  @IsString()
  @ApiProperty()
  operation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  details?: string | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  startTime?: Date | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  endTime?: Date | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  arguments?: string | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  stepCounts?: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  currrentStep?: string | null;

  @IsNumber()
  @ApiProperty()
  serviceInstanceId?: string;
}
