import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateApplicationPortDto {
  @ApiProperty({ example: 'TCP' })
  @IsString()
  protocol: string;

  @ApiProperty({ type: [String], example: ['22'] })
  @IsArray()
  @IsString({ each: true })
  destinationPorts: string[];
}
