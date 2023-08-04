import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsUUID } from 'class-validator';

export class TaskDataDTO {
  @ApiProperty({ example: '08904ddb-52c2-4c4e-b7b6-aaa51aa268b2' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'success' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'vm-e4e5e8d9-e925-4488-9e49-338923d86a4b' })
  @IsString()
  object: string;

  @ApiProperty({ example: 'jobAcquireScreenTicket' })
  @IsString()
  operation: string;

  @ApiProperty()
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @IsDate()
  endTime: Date;
}
