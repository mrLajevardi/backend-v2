import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
