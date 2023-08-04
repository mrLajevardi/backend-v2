import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsUUID } from 'class-validator';

export class SingleTaskDTO {
  @ApiProperty({ example: '08904ddb-52c2-4c4e-b7b6-aaa51aa268b2' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'success' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'jobAcquireScreenTicket' })
  @IsString()
  operation: string;

  @ApiProperty()
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @IsDate()
  endTime: Date;

  @ApiProperty({
    example:
      '66979cbf-8e5f-4a57-a95f-27f231629037 [ c88db33c-e946-4f86-9e32-e1e4cb2db468 ] Bad Request: Error occurred in the backing network provider: destination_network must be empty for Action REFLEXIVE., error code 508029',
  })
  @IsString()
  details: string;
}
