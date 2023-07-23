import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';

export class CreateTicketsDto {
  @ApiProperty({ type: Number })
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  ticketId: number;

  @ApiProperty({ type: Number })
  @IsString()
  serviceInstanceId?: string;
}
