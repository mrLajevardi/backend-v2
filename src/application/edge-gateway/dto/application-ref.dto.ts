import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApplicationRefDto {
  @ApiProperty({ example: 'urn:vcloud:applicationPortProfile:a8faa892-0f54-31ab-9128-5cc4485c0f82' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'DNS' })
  @IsString()
  name: string;
}
