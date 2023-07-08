import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FirewallGroupDto {
  @ApiProperty({ example: 'urn:vcloud:firewallGroup:7846d876-c638-4574-a45c-49c85ccf7ca4' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  name: string;
}
