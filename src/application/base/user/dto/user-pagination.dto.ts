// src/dto/pagination.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

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
