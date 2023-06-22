import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';

export class UpdateTicketsDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  userId?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  ticketId?: number;

  @ApiPropertyOptional({ type: ServiceInstances })
  @IsOptional()
  @IsObject()
  serviceInstance?: ServiceInstances;
}
