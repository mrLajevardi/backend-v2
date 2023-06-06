import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject } from 'class-validator';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';

export class CreateTicketDto {
  @ApiProperty({ type: Number })
  @IsInt()
  id: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsNotEmpty()
  ticketId: number;

  @ApiProperty({ type: ServiceInstances })
  @IsObject()
  serviceInstance: ServiceInstances;
}
