import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class IPSetDto {
  @ApiProperty({
    example: 'urn:vcloud:firewallGroup:2cc8770b-0373-4937-a9c2-a7ba32baa7d3',
  })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ example: 'test', required: true })
  @IsString()
  name: string;

  @ApiProperty({
    type: [String],
    example: ['192.168.1.1'],
    default: [],
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  ipList: string[];

  @ApiProperty({ required: true })
  @IsString()
  description: string;
}
