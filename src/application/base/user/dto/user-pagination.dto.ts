// src/dto/pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { IsNull } from 'typeorm';

export class UserPaginationDto {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false, default: 1, type: Number })
  page?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false, default: 10, type: Number })
  limit?: number;
}
