import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class ApplicationPortsDto {
  @ApiProperty({ example: 'TCP' })
  @IsString()
  protocol: string;

  @ApiProperty({ type: [String], example: ['22'] })
  @IsArray()
  ports: string[];
}
